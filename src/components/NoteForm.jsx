import { useState } from "react";
import ColorPicker, { DEFAULT_NOTE_COLOR } from "./ColorPicker";
import { validateNote } from "../lib/validation";

export default function NoteForm({
  initial = { title: "", body: "", color: DEFAULT_NOTE_COLOR },
  submitLabel = "Save note",
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleColorChange = (color) => {
    setForm((prev) => ({ ...prev, color }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateNote(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      onSubmit(form);
      if (!onCancel) setForm({ title: "", body: "", color: DEFAULT_NOTE_COLOR });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="note-form card" onSubmit={handleSubmit}>
      <h3 className="note-form__title">{onCancel ? "Edit note" : "New note"}</h3>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <label className="field">
        <span>Title</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Note title"
          maxLength={120}
          required
        />
      </label>

      <label className="field">
        <span>Body</span>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Write your note…"
          rows={6}
          maxLength={10000}
        />
      </label>

      <label className="field">
        <span>Color</span>
        <ColorPicker value={form.color} onChange={handleColorChange} />
      </label>

      <div className="note-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
