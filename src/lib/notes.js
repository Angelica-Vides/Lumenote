import { supabase } from "./supabase";
import { validateNote, DEFAULT_NOTE_COLOR } from "./validation";

export function mapDbError(error) {
  if (!error) return "Something went wrong. Please try again.";

  const message = error.message?.toLowerCase() || "";

  switch (error.code) {
    case "23514":
      return "Note data failed validation.";
    case "42501":
      return "You don't have permission to perform this action.";
    case "PGRST116":
      return "That note could not be found. It may have been deleted.";
    case "42P01":
      return "Notes table missing. Run supabase/schema.sql in your Supabase SQL Editor.";
    case "23503":
      return "Could not save note. Please sign out and log in again.";
    default:
      break;
  }

  if (message.includes("jwt") || message.includes("session")) {
    return "Your session expired. Please log in again.";
  }
  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Network error. Check your connection and try again.";
  }
  if (message.includes("duplicate")) {
    return "A note with this data already exists.";
  }

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

export async function fetchNote(noteId) {
  const { data, error } = await supabase.from("notes").select("*").eq("id", noteId).single();

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
      body: input.body ?? "",
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
    if (validationError) throw new Error(validationError);
  }

  const payload = {};
  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.body !== undefined) payload.body = updates.body ?? "";
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
