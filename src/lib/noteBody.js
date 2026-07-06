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
  "figure",
  "img",
];

const ALLOWED_ATTR = ["style", "src", "alt", "class"];

function wrapNoteImages(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("img").forEach((img) => {
    if (img.closest(".note-image-taped")) return;

    const figure = doc.createElement("figure");
    figure.className = "note-image-taped";
    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);
  });

  return doc.body.innerHTML;
}

export function stripHtml(html = "") {
  if (!html) return "";
  if (!html.includes("<")) return html.trim();

  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function sanitizeNoteHtml(html = "") {
  if (!html) return "";
  const raw = !html.includes("<")
    ? DOMPurify.sanitize(`<p>${html}</p>`, { ALLOWED_TAGS, ALLOWED_ATTR })
    : DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });

  return wrapNoteImages(raw);
}

export function notePreviewText(body = "", maxLength = 140) {
  const text = stripHtml(body) || "No content";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function isEmptyNoteBody(body = "") {
  return stripHtml(body).length === 0;
}
