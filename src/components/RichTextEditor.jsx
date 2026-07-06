import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";
import { useEffect, useRef, useState } from "react";
import { stripHtml } from "../lib/noteBody";
import { uploadNoteImage } from "../lib/noteImages";
import {
  BULLET_STYLE_OPTIONS,
  ORDERED_STYLE_OPTIONS,
  StyledBulletList,
  StyledOrderedList,
  getDefaultBulletStyle,
  getDefaultOrderedStyle,
} from "../lib/richTextLists";
import { NOTE_BODY_TEXT_LIMIT } from "../lib/validation";

const FONT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Sans", value: "Inter, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, monospace" },
];

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      className={`rte-toolbar__btn${active ? " rte-toolbar__btn--active" : ""}`}
      onClick={onClick}
      title={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function formatCount(value) {
  return value.toLocaleString();
}

function ListStyleDropdown({ label, options, currentValue, isActive, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const currentOption = options.find((option) => option.value === currentValue) || options[0];

  return (
    <div className="rte-toolbar__dropdown" ref={rootRef}>
      <button
        type="button"
        className={`rte-toolbar__dropdown-trigger${isActive ? " rte-toolbar__dropdown-trigger--active" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <span className="rte-toolbar__list-icon">{currentOption.icon}</span>
        <span className="rte-toolbar__dropdown-caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="rte-toolbar__dropdown-menu rte-toolbar__group" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isActive && currentValue === option.value}
              className={`rte-toolbar__btn rte-toolbar__dropdown-option${
                isActive && currentValue === option.value ? " rte-toolbar__btn--active" : ""
              }`}
              title={option.title}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              <span className="rte-toolbar__list-icon">{option.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RichTextEditor({ value, onChange, userId, onError }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [charCount, setCharCount] = useState(() => stripHtml(value || "").length);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: false,
        orderedList: false,
      }),
      StyledBulletList,
      StyledOrderedList,
      Underline,
      TextStyle,
      FontFamily,
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "rte-editor__content",
        "aria-label": "Note body",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      setCharCount(stripHtml(html).length);
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next !== current) {
      editor.commands.setContent(next, false);
      setCharCount(stripHtml(next).length);
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rte-editor rte-editor--loading" aria-busy="true">
        <div className="rte-toolbar rte-toolbar--placeholder" />
        <div className="rte-editor__content rte-editor__content--placeholder">
          Loading editor…
        </div>
      </div>
    );
  }

  const setFont = (fontFamily) => {
    if (!fontFamily) {
      editor.chain().focus().unsetFontFamily().run();
      return;
    }
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  const applyBulletStyle = (styleClass) => {
    const chain = editor.chain().focus();
    if (!editor.isActive("bulletList")) {
      chain.toggleBulletList();
    }
    chain.updateAttributes("bulletList", { class: styleClass }).run();
  };

  const applyOrderedStyle = (styleClass) => {
    const chain = editor.chain().focus();
    if (!editor.isActive("orderedList")) {
      chain.toggleOrderedList();
    }
    chain.updateAttributes("orderedList", { class: styleClass }).run();
  };

  const currentBulletStyle = editor.isActive("bulletList")
    ? editor.getAttributes("bulletList").class || getDefaultBulletStyle()
    : getDefaultBulletStyle();

  const currentOrderedStyle = editor.isActive("orderedList")
    ? editor.getAttributes("orderedList").class || getDefaultOrderedStyle()
    : getDefaultOrderedStyle();

  const handleBulletStyle = (styleClass) => {
    if (editor.isActive("bulletList") && currentBulletStyle === styleClass) {
      editor.chain().focus().toggleBulletList().run();
      return;
    }
    applyBulletStyle(styleClass);
  };

  const handleOrderedStyle = (styleClass) => {
    if (editor.isActive("orderedList") && currentOrderedStyle === styleClass) {
      editor.chain().focus().toggleOrderedList().run();
      return;
    }
    applyOrderedStyle(styleClass);
  };

  const atLimit = charCount >= NOTE_BODY_TEXT_LIMIT;
  const nearLimit = charCount >= NOTE_BODY_TEXT_LIMIT * 0.9;

  const handleImagePick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    onError?.("");
    try {
      const url = await uploadNoteImage(userId, file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      onError?.(err.message || "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rte-editor">
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting toolbar">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="rte-toolbar__underline">U</span>
        </ToolbarButton>

        <span className="rte-toolbar__divider" aria-hidden="true" />

        <ToolbarButton
          title="Subtitle (heading 2)"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Small heading (heading 3)"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <span className="rte-toolbar__divider" aria-hidden="true" />

        <ListStyleDropdown
          label="Bullet list style"
          options={BULLET_STYLE_OPTIONS}
          currentValue={currentBulletStyle}
          isActive={editor.isActive("bulletList")}
          onSelect={handleBulletStyle}
        />

        <ListStyleDropdown
          label="Numbered list style"
          options={ORDERED_STYLE_OPTIONS}
          currentValue={currentOrderedStyle}
          isActive={editor.isActive("orderedList")}
          onSelect={handleOrderedStyle}
        />

        <label className="rte-toolbar__select-wrap">
          <span className="visually-hidden">Font</span>
          <select
            className="rte-toolbar__select"
            defaultValue=""
            onChange={(e) => setFont(e.target.value)}
            aria-label="Font family"
          >
            {FONT_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <span className="rte-toolbar__divider" aria-hidden="true" />

        <button
          type="button"
          className="rte-toolbar__btn rte-toolbar__btn--image"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload image"
        >
          {uploading ? "Uploading…" : "📷 Add image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          hidden
          onChange={handleImagePick}
        />
      </div>

      <EditorContent editor={editor} />

      <div
        className={`rte-editor__counter${nearLimit ? " rte-editor__counter--warn" : ""}${atLimit ? " rte-editor__counter--limit" : ""}`}
        aria-live="polite"
      >
        {formatCount(charCount)} / {formatCount(NOTE_BODY_TEXT_LIMIT)} characters
        {atLimit && " · limit reached"}
      </div>
    </div>
  );
}
