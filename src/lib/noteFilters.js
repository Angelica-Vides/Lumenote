import { stripHtml } from "./noteBody";

export const SORT_OPTIONS = [
  { value: "updated_desc", label: "Newest first" },
  { value: "updated_asc", label: "Oldest first" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
];

function compareBySort(a, b, sortBy) {
  switch (sortBy) {
    case "updated_asc":
      return new Date(a.updated_at) - new Date(b.updated_at);
    case "title_asc":
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    case "title_desc":
      return b.title.localeCompare(a.title, undefined, { sensitivity: "base" });
    case "updated_desc":
    default:
      return new Date(b.updated_at) - new Date(a.updated_at);
  }
}

export function filterNotes(notes, query = "") {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return notes;

  return notes.filter((note) => {
    const haystack = `${note.title} ${stripHtml(note.body || "")}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function sortNotesList(notes, sortBy = "updated_desc") {
  const pinned = notes.filter((note) => note.pinned).sort((a, b) => compareBySort(a, b, sortBy));
  const unpinned = notes.filter((note) => !note.pinned).sort((a, b) => compareBySort(a, b, sortBy));
  return [...pinned, ...unpinned];
}

export function applyNoteFilters(notes, { query = "", sortBy = "updated_desc" } = {}) {
  return sortNotesList(filterNotes(notes, query), sortBy);
}
