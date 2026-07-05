import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";
import { useEffect, useRef, useState } from "react";
import { uploadNoteImage } from "../lib/noteImages";

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

export default function RichTextEditor({ value, onChange, userId, onError }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
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
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next !== current) {
      editor.commands.setContent(next, false);
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

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>

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
    </div>
  );
}
