import { stripHtml } from "./noteBody";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NOTE_TITLE_LIMIT = 120;
export const NOTE_BODY_TEXT_LIMIT = 20000;
export const NOTE_BODY_HTML_LIMIT = 100000;

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

export function mapAuthError(message) {
  if (!message) return "Something went wrong. Please try again.";
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Incorrect email or password.";
  if (lower.includes("email not confirmed")) return "Please confirm your email before logging in.";
  if (lower.includes("user already registered")) {
    return "An account with this email already exists. Try logging in.";
  }
  return message;
}

export function validateNote({ title, body = "", color = DEFAULT_NOTE_COLOR }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return "Title is required.";
  if (trimmedTitle.length > NOTE_TITLE_LIMIT) {
    return `Title must be ${NOTE_TITLE_LIMIT.toLocaleString()} characters or fewer.`;
  }
  if (stripHtml(body).length > NOTE_BODY_TEXT_LIMIT) {
    return `Body text must be ${NOTE_BODY_TEXT_LIMIT.toLocaleString()} characters or fewer.`;
  }
  if (body.length > NOTE_BODY_HTML_LIMIT) return "Note content is too large.";
  if (!isValidHexColor(color)) return "Invalid color format.";
  return null;
}
