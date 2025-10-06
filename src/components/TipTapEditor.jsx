/* eslint-disable no-unused-vars */
import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

const TipTapEditor = forwardRef(
  (
    { content, onChange, placeholder = "Start typing your thoughts... ✨" },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
        CharacterCount.configure({
          limit: 50000,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class:
              "text-blue-600 underline hover:text-blue-800 transition-colors duration-200",
          },
        }),
        Underline,
      ],
      content: content || "",
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-lg max-w-none focus:outline-none p-6 min-h-96 leading-relaxed text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:italic prose-blockquote:py-2 prose-blockquote:px-4 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-ul:list-disc prose-ol:list-decimal prose-li:my-1",
        },
      },
    });

    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content || "");
      }
    }, [content, editor]);

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      getEditor: () => editor,
    }));

    if (!editor) {
      return null;
    }

    return (
      <div className="w-full h-full flex flex-col">
        {/* Scrollable Editor Content */}
        <div className="flex-1 overflow-auto bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
          <div className="min-h-96">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;