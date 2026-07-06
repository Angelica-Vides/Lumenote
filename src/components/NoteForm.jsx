import { useState } from "react";
import ColorPicker, { DEFAULT_NOTE_COLOR } from "./ColorPicker";
import RichTextEditor from "./RichTextEditor";
import { useAuth } from "../context/AuthContext";
import { validateNote, NOTE_TITLE_LIMIT, NOTE_BODY_TEXT_LIMIT } from "../lib/validation";
import { stripHtml } from "../lib/noteBody";

export default function NoteForm({
  initial = { title: "", body: "", color: DEFAULT_NOTE_COLOR },
  submitLabel = "Save note",
  showHeading = true,
  onSubmit,
  onCancel,
}) {
  const { user } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateNote(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
      if (!onCancel) setForm({ title: "", body: "", color: DEFAULT_NOTE_COLOR });
    } catch (err) {
      setError(err.message || "Could not save note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="note-form card" onSubmit={handleSubmit} noValidate>
      {showHeading && (
        <h3 className="note-form__title">{onCancel ? "Edit note" : "New note"}</h3>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <label className="field">
        <span className="field__label-row">
          <span>Title</span>
          <span className="field__counter">{form.title.length} / {NOTE_TITLE_LIMIT}</span>
        </span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Note title"
          maxLength={NOTE_TITLE_LIMIT}
        />
      </label>

      <div className="field field--rte">
        <span>Body</span>
        <RichTextEditor
          value={form.body}
          userId={user?.id}
          onChange={(body) => {
            setForm((prev) => ({ ...prev, body }));
            setError("");
          }}
          onError={setError}
        />
        <p className="field__hint">
          Up to {NOTE_BODY_TEXT_LIMIT.toLocaleString()} characters of text. Use headings, lists, fonts,
          and images (max 2 MB each).
          {stripHtml(form.body).length >= NOTE_BODY_TEXT_LIMIT * 0.9 && (
            <span className="field__hint-warn">
              {" "}
              You are approaching the character limit.
            </span>
          )}
        </p>
      </div>

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
