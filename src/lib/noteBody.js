import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "span",
  "img",
];

const ALLOWED_ATTR = ["style", "src", "alt", "class"];

export function stripHtml(html = "") {
  if (!html) return "";
  if (!html.includes("<")) return html.trim();

  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function sanitizeNoteHtml(html = "") {
  if (!html) return "";
  if (!html.includes("<")) {
    return DOMPurify.sanitize(`<p>${html}</p>`, { ALLOWED_TAGS, ALLOWED_ATTR });
  }

  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

export function notePreviewText(body = "", maxLength = 140) {
  const text = stripHtml(body) || "No content";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function isEmptyNoteBody(body = "") {
  return stripHtml(body).length === 0;
}
