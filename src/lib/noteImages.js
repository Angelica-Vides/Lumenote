import { supabase } from "./supabase";

const BUCKET = "note-images";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function uploadNoteImage(userId, file) {
  if (!userId) throw new Error("Please log in to upload images.");
  if (!file) throw new Error("No image selected.");
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Use JPEG, PNG, GIF, or WebP images only.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 2 MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    if (error.message?.includes("Bucket not found")) {
      throw new Error("Image storage is not set up. Run supabase/migrations/002_note_images_storage.sql.");
    }
    throw new Error(error.message || "Could not upload image.");
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error("Could not get image URL after upload.");
  }

  return data.publicUrl;
}
