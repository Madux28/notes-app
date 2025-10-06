import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Type,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TipTapEditor = forwardRef(
  (
    { content, onChange, placeholder = "Start typing your thoughts... ✨" },
    ref
  ) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [activeTool, setActiveTool] = useState(null);

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

    const addLink = () => {
      if (!url) return;
      editor.chain().focus().setLink({ href: url }).run();
      setUrl("");
      setIsDialogOpen(false);
    };

    const ToolbarButton = ({
      onClick,
      isActive,
      children,
      title,
      toolName,
    }) => (
      <Button
        variant="ghost"
        size="sm"
        // eslint-disable-next-line no-unused-vars
        onClick={(e) => {
          onClick();
          setActiveTool(toolName);
          setTimeout(() => setActiveTool(null), 300);
        }}
        title={title}
        type="button"
        className={cn(
          "h-9 w-9 p-0 rounded-lg transition-all duration-300 relative overflow-hidden group",
          isActive
            ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105"
            : "bg-white/80 text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-md border border-gray-200/50"
        )}
      >
        {activeTool === toolName && (
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg" />
        )}
        <div
          className={cn(
            "transition-transform duration-300",
            isActive && "scale-110"
          )}
        >
          {children}
        </div>
      </Button>
    );

    const characterCount = editor.storage.characterCount;
    const charPercentage = (characterCount.characters() / 50000) * 100;

    return (
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/50 p-3">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold (Ctrl+B)"
                toolName="bold"
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic (Ctrl+I)"
                toolName="italic"
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                title="Underline"
                toolName="underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                title="Strikethrough"
                toolName="strike"
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                title="Code"
                toolName="code"
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <Separator
              orientation="vertical"
              className="h-6 mx-1 bg-gray-300/50"
            />

            {/* Headings */}
            <div className="flex items-center gap-1 mr-2">
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                isActive={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
                toolName="h1"
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
                toolName="h2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
                toolName="h3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <Separator
              orientation="vertical"
              className="h-6 mx-1 bg-gray-300/50"
            />

            {/* Lists */}
            <div className="flex items-center gap-1 mr-2">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
                toolName="bullet"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Numbered List"
                toolName="ordered"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Quote"
                toolName="quote"
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <Separator
              orientation="vertical"
              className="h-6 mx-1 bg-gray-300/50"
            />

            {/* Links & Actions */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => setIsDialogOpen(true)}
                isActive={editor.isActive("link")}
                title="Add Link"
                toolName="link"
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo (Ctrl+Z)"
                toolName="undo"
              >
                <Undo className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo (Ctrl+Y)"
                toolName="redo"
              >
                <Redo className="h-4 w-4" />
              </ToolbarButton>
            </div>
          </div>

          {/* Link Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-blue-600">
                  <LinkIcon className="h-5 w-5" />
                  Add Link
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Enter the URL you want to link to. Make sure it starts with
                  http:// or https://
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-400 rounded-xl py-3 transition-all duration-300"
                  autoFocus
                />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Press Enter to quickly add the link</span>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-xl border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addLink}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl"
                  disabled={!url}
                >
                  Add Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Editor Content */}
        <div className="bg-white/50 min-h-96">
          <EditorContent editor={editor} />
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Type className="h-4 w-4 text-blue-500" />
                <span>{characterCount.words()} words</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Palette className="h-4 w-4 text-purple-500" />
                <span>{characterCount.characters()} characters</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>{Math.ceil(characterCount.words() / 200)} min read</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    charPercentage > 90
                      ? "bg-red-500"
                      : charPercentage > 75
                        ? "bg-amber-500"
                        : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(charPercentage, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 font-mono min-w-12">
                {characterCount.characters()}/50k
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;
