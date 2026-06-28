import { supabase } from "./supabase";
import { validateNote, DEFAULT_NOTE_COLOR } from "./validation";

function mapDbError(error) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.code === "23514") return "Note data failed validation.";
  if (error.code === "42501") return "You do not have permission to perform this action.";
  return error.message || "Something went wrong. Please try again.";
}

export async function fetchNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw new Error(mapDbError(error));
  return data;
}

export async function createNote(userId, input) {
  const validationError = validateNote(input);
  if (validationError) throw new Error(validationError);

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      title: input.title.trim(),
      body: input.body?.trim() || "",
      color: input.color || DEFAULT_NOTE_COLOR,
      pinned: false,
    })
    .select()
    .single();

  if (error) throw new Error(mapDbError(error));
  return data;
}

export async function updateNote(noteId, updates) {
  if (updates.title !== undefined || updates.body !== undefined || updates.color !== undefined) {
    const validationError = validateNote({
      title: updates.title ?? "placeholder",
      body: updates.body ?? "",
      color: updates.color ?? DEFAULT_NOTE_COLOR,
    });
    if (validationError && updates.title !== undefined) throw new Error(validationError);
  }

  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.body !== undefined) payload.body = updates.body.trim();
  if (updates.color !== undefined) payload.color = updates.color;
  if (updates.pinned !== undefined) payload.pinned = updates.pinned;

  const { data, error } = await supabase
    .from("notes")
    .update(payload)
    .eq("id", noteId)
    .select()
    .single();

  if (error) throw new Error(mapDbError(error));
  return data;
}

export async function deleteNote(noteId) {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) throw new Error(mapDbError(error));
}
