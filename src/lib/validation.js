const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DEFAULT_NOTE_COLOR = "#2dd4bf";

export const COLOR_PRESETS = [
  "#2dd4bf",
  "#3b82f6",
  "#22c55e",
  "#a78bfa",
  "#f43f5e",
  "#f59e0b",
];

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export function isValidHexColor(color) {
  return HEX_RE.test(color);
}

export function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password, { isRegister = false } = {}) {
  if (!password) return "Password is required.";
  if (isRegister && password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateNote({ title, body = "", color = DEFAULT_NOTE_COLOR }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return "Title is required.";
  if (trimmedTitle.length > 120) return "Title must be 120 characters or fewer.";
  if (body.length > 10000) return "Body must be 10,000 characters or fewer.";
  if (!isValidHexColor(color)) return "Invalid color format.";
  return null;
}
