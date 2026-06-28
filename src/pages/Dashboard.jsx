import { useState } from "react";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { DEFAULT_NOTE_COLOR } from "../lib/validation";

const DUMMY_NOTES = [
  {
    id: "1",
    title: "Chem exam review",
    body: "Chapter 4–6: equilibrium, acids/bases, redox. Practice problems on page 142.",
    color: "#f59e0b",
    pinned: true,
    updated_at: "2026-06-20T12:00:00Z",
  },
  {
    id: "2",
    title: "History ch. 3 summary",
    body: "Key themes: industrialization, urban migration, labor movements in the 1890s.",
    color: "#3b82f6",
    pinned: false,
    updated_at: "2026-06-18T12:00:00Z",
  },
  {
    id: "3",
    title: "Essay outline",
    body: "Thesis: climate policy requires both top-down regulation and grassroots action.",
    color: "#a78bfa",
    pinned: false,
    updated_at: "2026-06-15T12:00:00Z",
  },
];

export default function Dashboard() {
  const [notes, setNotes] = useState(DUMMY_NOTES);
  const [editingNote, setEditingNote] = useState(null);

  const handleCreate = (form) => {
    const now = new Date().toISOString();
    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        body: form.body.trim(),
        color: form.color || DEFAULT_NOTE_COLOR,
        pinned: false,
        updated_at: now,
      },
      ...prev,
    ]);
  };

  const handleUpdate = (form) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: form.title.trim(),
              body: form.body.trim(),
              color: form.color,
              updated_at: new Date().toISOString(),
            }
          : n
      )
    );
    setEditingNote(null);
  };

  const handleTogglePin = (note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDelete = (noteId) => {
    if (!window.confirm("Delete this note permanently?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (editingNote?.id === noteId) setEditingNote(null);
  };

  return (
    <section className="dashboard container">
      <header className="dashboard__header">
        <div>
          <h1>My Notes</h1>
          <p className="muted">Scaffold preview — dummy data (Step 1)</p>
        </div>
      </header>

      {editingNote ? (
        <NoteForm
          initial={{
            title: editingNote.title,
            body: editingNote.body,
            color: editingNote.color,
          }}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
          onCancel={() => setEditingNote(null)}
        />
      ) : (
        <NoteForm onSubmit={handleCreate} />
      )}

      <NoteList
        notes={notes}
        onEdit={setEditingNote}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />
    </section>
  );
}
