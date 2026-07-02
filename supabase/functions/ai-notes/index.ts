import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AI_ACTIONS = {
  summarize: "summarize",
  suggest: "suggest",
} as const;

const RATE_LIMIT_PER_HOUR = 8;

type AiAction = keyof typeof AI_ACTIONS;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanJson(content: string) {
  return content.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
}

function buildPrompt(action: AiAction, notes: Array<{ title: string; body: string; pinned: boolean }>) {
  const noteContext = notes
    .map((note, index) => {
      const pinLabel = note.pinned ? "pinned" : "unpinned";
      return `${index + 1}. ${note.title} (${pinLabel})\n${note.body || "No body text."}`;
    })
    .join("\n\n");

  if (action === "summarize") {
    return {
      system:
        "You are Lumenote's study assistant. Summarize personal notes clearly and safely. Return only valid JSON.",
      user: `Summarize these notes for the note owner. Return JSON with keys: overview (string), keyPoints (array of 3-5 strings), and followUps (array of 2-4 short study actions).\n\nNotes:\n${noteContext}`,
    };
  }

  return {
    system:
      "You are Lumenote's study assistant. Generate practical next-note ideas from the user's existing notes. Return only valid JSON.",
    user: `Based on these notes, suggest useful new notes or study tasks. Return JSON with key suggestions, an array of 3-5 objects. Each object must have title, rationale, and starterText.\n\nNotes:\n${noteContext}`,
  };
}

async function callOpenAi(action: AiAction, notes: Array<{ title: string; body: string; pinned: boolean }>) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return {
      error: "AI is not configured yet. Add OPENAI_API_KEY to the Supabase Edge Function secrets.",
      status: 503,
    };
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
  const prompt = buildPrompt(action, notes);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
    }),
  });

  if (response.status === 429) {
    return {
      error: "The AI provider is busy or rate limited. Please wait a minute and try again.",
      status: 429,
    };
  }

  if (!response.ok) {
    return {
      error: "The AI service could not complete that request. Please try again later.",
      status: response.status >= 500 ? 503 : 400,
    };
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return {
      error: "The AI service returned an empty response. Please try again.",
      status: 502,
    };
  }

  try {
    return { data: JSON.parse(cleanJson(content)), model };
  } catch (_error) {
    return {
      error: "The AI response was not in the expected format. Please try again.",
      status: 502,
    };
  }
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return jsonResponse({ error: "Please log in before using AI features." }, 401);
    }

    const { action } = await request.json();
    if (action !== AI_ACTIONS.summarize && action !== AI_ACTIONS.suggest) {
      return jsonResponse({ error: "Unsupported AI action." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: "Supabase function environment is not configured." }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return jsonResponse({ error: "Your session expired. Please log in again." }, 401);
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("ai_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgo);

    if (countError) {
      return jsonResponse(
        { error: "AI request tracking is not ready. Run the latest Supabase schema." },
        503,
      );
    }

    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return jsonResponse(
        {
          error: "You have reached the hourly AI limit. Please try again later.",
          code: "rate_limited",
          retryAfterSeconds: 3600,
        },
        429,
      );
    }

    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("title, body, pinned, updated_at")
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(25);

    if (notesError) {
      return jsonResponse({ error: "Could not load your notes for AI analysis." }, 500);
    }

    if (!notes || notes.length === 0) {
      return jsonResponse({ error: "Create at least one note before using AI assistance." }, 400);
    }

    const { error: insertError } = await supabase.from("ai_requests").insert({
      user_id: user.id,
      action,
    });

    if (insertError) {
      return jsonResponse({ error: "Could not track this AI request. Please try again." }, 500);
    }

    const aiResult = await callOpenAi(action, notes);
    if ("error" in aiResult) {
      return jsonResponse({ error: aiResult.error }, aiResult.status);
    }

    return jsonResponse({
      action,
      model: aiResult.model,
      result: aiResult.data,
      notesAnalyzed: notes.length,
    });
  } catch (_error) {
    return jsonResponse({ error: "Unexpected AI error. Please try again." }, 500);
  }
});
