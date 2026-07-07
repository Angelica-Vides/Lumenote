import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useBlocker } from "react-router-dom";
import ColorPicker, { DEFAULT_NOTE_COLOR } from "./ColorPicker";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "../context/AuthContext";
import { validateNote, NOTE_TITLE_LIMIT, NOTE_BODY_TEXT_LIMIT } from "../lib/validation";
import { stripHtml } from "../lib/noteBody";

const RichTextEditor = lazy(() => import("./RichTextEditor"));

function formsEqual(a, b) {
  return a.title === b.title && a.body === b.body && a.color === b.color;
}

export default function NoteForm({
  initial = { title: "", body: "", color: DEFAULT_NOTE_COLOR },
  submitLabel = "Save note",
  showHeading = true,
  onSubmit,
  onCancel,
  onSaved,
}) {
  const { user } = useAuth();
  const baseline = useMemo(
    () => ({
      title: initial.title ?? "",
      body: initial.body ?? "",
      color: initial.color ?? DEFAULT_NOTE_COLOR,
    }),
    [initial.title, initial.body, initial.color],
  );
  const [form, setForm] = useState(baseline);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [leaveOpen, setLeaveOpen] = useState(false);

  const isDirty = !formsEqual(form, baseline);
  const blocker = useBlocker(isDirty && !submitting);

  useEffect(() => {
    setForm(baseline);
  }, [baseline]);

  useEffect(() => {
    if (!isDirty) return undefined;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setLeaveOpen(true);
    }
  }, [blocker.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleColorChange = (color) => {
    setForm((prev) => ({ ...prev, color }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateNote(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
      onSaved?.();
      if (!onCancel) setForm({ title: "", body: "", color: DEFAULT_NOTE_COLOR });
    } catch (err) {
      setError(err.message || "Could not save note.");
    } finally {
      setSubmitting(false);
    }
  };

  const requestCancel = () => {
    if (isDirty) {
      setLeaveOpen(true);
      return;
    }
    onCancel?.();
  };

  const confirmLeave = () => {
    setLeaveOpen(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
      return;
    }
    onCancel?.();
  };

  const stayOnPage = () => {
    setLeaveOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  return (
    <>
      <form className="note-form card" onSubmit={handleSubmit} noValidate>
        {showHeading && (
          <h3 className="note-form__title">{onCancel ? "Edit note" : "New note"}</h3>
        )}
        {isDirty && <p className="note-form__dirty-hint">Unsaved changes</p>}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <label className="field">
          <span className="field__label-row">
            <span>Title</span>
            <span className="field__counter">
              {form.title.length} / {NOTE_TITLE_LIMIT}
            </span>
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
          <Suspense
            fallback={
              <div className="rte-editor rte-editor--loading" aria-busy="true">
                <div className="rte-toolbar rte-toolbar--placeholder" />
                <div className="rte-editor__content rte-editor__content--placeholder">
                  Loading editor…
                </div>
              </div>
            }
          >
            <RichTextEditor
              value={form.body}
              userId={user?.id}
              onChange={(body) => {
                setForm((prev) => ({ ...prev, body }));
                setError("");
              }}
              onError={setError}
            />
          </Suspense>
          <p className="field__hint">
            Up to {NOTE_BODY_TEXT_LIMIT.toLocaleString()} characters of text. Use headings, lists,
            fonts, and images (max 2 MB each, compressed automatically).
            {stripHtml(form.body).length >= NOTE_BODY_TEXT_LIMIT * 0.9 && (
              <span className="field__hint-warn"> You are approaching the character limit.</span>
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
            <button type="button" className="btn btn--ghost" onClick={requestCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ConfirmModal
        open={leaveOpen}
        title="Leave without saving?"
        message="You have unsaved changes. Leave this page and discard them?"
        confirmLabel="Leave without saving"
        danger
        onCancel={stayOnPage}
        onConfirm={confirmLeave}
      />
    </>
  );
}
