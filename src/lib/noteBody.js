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
  "div",
  "img",
];

const ALLOWED_ATTR = ["style", "src", "alt", "class"];

function trimEmptyElement(element) {
  if (!element.parentNode) return;

  const hasMeaningfulContent = [...element.childNodes].some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent.trim());
    return true;
  });

  if (!hasMeaningfulContent) {
    element.remove();
  }
}

function hoistFigure(doc, figure) {
  while (true) {
    const parent = figure.parentElement;
    if (!parent || parent === doc.body) {
      break;
    }

    parent.parentNode.insertBefore(figure, parent.nextSibling);
    trimEmptyElement(parent);
  }
}

function wrapNoteImages(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("img").forEach((img) => {
    if (img.closest(".note-image-taped")) return;

    img.removeAttribute("width");
    img.removeAttribute("height");
    img.removeAttribute("style");
    img.removeAttribute("class");

    const figure = doc.createElement("figure");
    figure.className = "note-image-taped";

    const mat = doc.createElement("div");
    mat.className = "note-image-mat";

    const parent = img.parentNode;
    parent.insertBefore(figure, img);
    figure.appendChild(mat);
    mat.appendChild(img);

    hoistFigure(doc, figure);
  });

  doc.body.querySelectorAll(".note-image-taped img").forEach((img) => {
    if (img.closest(".note-image-mat")) return;

    const mat = doc.createElement("div");
    mat.className = "note-image-mat";
    const figure = img.closest(".note-image-taped");
    figure.insertBefore(mat, img);
    mat.appendChild(img);
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

export function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
