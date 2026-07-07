import { supabase } from "./supabase";

async function readFunctionError(error) {
  if (!error) return null;

  if (error.context?.json) {
    try {
      const details = await error.context.json();
      return details?.error || error.message;
    } catch (_err) {
      return error.message;
    }
  }

  return error.message;
}

export async function runNoteAi(action, noteIds = []) {
  const { data, error } = await supabase.functions.invoke("ai-notes", {
    body: { action, noteIds },
  });

  if (error) {
    const message = await readFunctionError(error);
    throw new Error(message || "AI assistant is unavailable. Please try again.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}
