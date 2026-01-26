"use client";
import React from "react";
import { dataTransferToMarkdown } from "./markdownFormatters";

/**
 * The plain text part of a markdown editor component.
 * This is functionally the same as a regular textarea, but paste events read
 * attempt to read from the `text/html` buffer and transform it into
 * GitHub Flavored Markdown.
 * @param param0.value The current value of the editor.
 * @param param0.onChange Callback to update the value of the editor.
 * @param param0.onPasteImage Callback to handle pasting images.
 * This should convert an image URL which may have origin access issues into one
 * that does not.
 */
export default function MarkdownEditorPlainText({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  /**
   * Intercept a paste event and convert the pasted content to markdown if possible.
   */
  async function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    if (e.target === null) throw new Error("No target for paste event");
    if (!(e.target instanceof HTMLTextAreaElement))
      throw new Error("Target is not a text area");
    const target = e.target;

    const pastedText = await dataTransferToMarkdown(e.clipboardData);

    const newText =
      value.substring(0, target.selectionStart) +
      pastedText +
      value.substring(target.selectionEnd);

    const newCursorPosition = target.selectionStart + pastedText.length;

    target.value = newText;

    onChange(newText);

    target.setSelectionRange(newCursorPosition, newCursorPosition, "none");
    setLoading(false);
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <textarea
        className="absolute inset-0 resize-none font-mono"
        value={value}
        onPaste={onPaste}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/50 ${loading ? "opacity-100" : "opacity-0"} pointer-events-none transition-opacity duration-1000`}
      >
        <div className="text-9xl">Uploading...</div>
      </div>
    </div>
  );
}
