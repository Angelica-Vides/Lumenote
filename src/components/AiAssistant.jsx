import { useState } from "react";
import { runNoteAi } from "../lib/ai";

function ResultList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <ul className="ai-result__list">
      {items.map((item, index) => (
        <li key={typeof item === "string" ? `${item}-${index}` : `${item.title}-${index}`}>
          {typeof item === "string" ? (
            item
          ) : (
            <>
              <strong>{item.title}</strong>
              <span>{item.rationale}</span>
              {item.starterText && <em>{item.starterText}</em>}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function AiResult({ response }) {
  if (!response?.result) return null;

  const { action, result, notesAnalyzed } = response;

  if (action === "suggest") {
    return (
      <div className="ai-result" aria-live="polite">
        <p className="ai-result__meta">AI reviewed {notesAnalyzed} note(s).</p>
        <ResultList items={result.suggestions} />
      </div>
    );
  }

  return (
    <div className="ai-result" aria-live="polite">
      <p className="ai-result__meta">AI reviewed {notesAnalyzed} note(s).</p>
      <p>{result.overview}</p>
      <h4>Key points</h4>
      <ResultList items={result.keyPoints} />
      <h4>Follow-ups</h4>
      <ResultList items={result.followUps} />
    </div>
  );
}

export default function AiAssistant({ noteCount }) {
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const handleRun = async (action) => {
    setLoadingAction(action);
    setError("");
    try {
      const result = await runNoteAi(action);
      setResponse(result);
    } catch (err) {
      setError(err.message || "AI assistant is unavailable. Please try again.");
    } finally {
      setLoadingAction("");
    }
  };

  const disabled = noteCount === 0 || Boolean(loadingAction);

  return (
    <section className="ai-assistant card">
      <div>
        <p className="ai-assistant__eyebrow">AI study assistant</p>
        <h2>Turn your notes into next steps</h2>
        <p className="muted">
          Summarize your saved notes or generate study ideas based on your latest work.
        </p>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="ai-assistant__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => handleRun("summarize")}
          disabled={disabled}
        >
          {loadingAction === "summarize" ? "Summarizing..." : "Summarize notes"}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => handleRun("suggest")}
          disabled={disabled}
        >
          {loadingAction === "suggest" ? "Thinking..." : "Suggest study notes"}
        </button>
      </div>

      {noteCount === 0 && (
        <p className="ai-assistant__hint">Create a note first, then Lumenote can analyze it.</p>
      )}

      {loadingAction && (
        <div className="loading-panel loading-panel--compact" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Asking AI to review your notes...
        </div>
      )}

      <AiResult response={response} />
    </section>
  );
}
