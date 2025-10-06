import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import {
  ArrowLeft,
  Trash2,
  Archive,
  Copy,
  Save,
  RotateCcw,
  Download,
  Sparkles,
  Zap,
  Clock,
  Tag,
  Edit3,
  Shield,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import TipTapEditor from "./TipTapEditor";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function NoteEditor() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const editorRef = useRef(null);

  const isNewNote = !noteId;

  const note = useQuery(
    api.notes.getNotes,
    user && noteId ? { userId: user.id } : "skip"
  );

  const createNote = useMutation(api.notes.createNote);
  const updateNote = useMutation(api.notes.updateNote);
  const deleteNote = useMutation(api.notes.deleteNote);
  const toggleArchive = useMutation(api.notes.toggleArchiveNote);

  const currentNote = note?.find((n) => n._id === noteId);

  useEffect(() => {
    if (currentNote && !isModified) {
      setTitle(currentNote.title || "");
      setContent(currentNote.content || "");
      setTags(currentNote.tags?.join(", ") || "");
    }
  }, [currentNote, isModified]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isModified]);

  const handleSave = useCallback(
    async (silent = false) => {
      if (!user || !title.trim()) {
        if (!title.trim()) {
          toast.error("Please enter a title for your note");
        }
        return;
      }

      setIsSaving(true);

      try {
        const tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (isNewNote) {
          await createNote({
            title: title.trim(),
            content: content.trim(),
            tags: tagArray,
            userId: user.id,
          });
        } else {
          await updateNote({
            id: noteId,
            title: title.trim(),
            content: content.trim(),
            tags: tagArray,
          });
        }

        setIsModified(false);
        setLastSaved(new Date());

        if (!silent) {
          toast.success(
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-green-500" />
              <span>Note saved successfully</span>
            </div>
          );
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to save note:", error);
        toast.error(
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-red-500" />
            <span>Failed to save note</span>
          </div>
        );
      } finally {
        setIsSaving(false);
      }
    },
    [
      content,
      createNote,
      isNewNote,
      navigate,
      noteId,
      tags,
      title,
      updateNote,
      user,
    ]
  );

  // Auto-save functionality
  useEffect(() => {
    if (isModified && !isNewNote && title.trim()) {
      const saveTimer = setTimeout(async () => {
        await handleSave(true);
        toast.info("Note auto-saved", {
          duration: 1000,
          position: "bottom-right",
        });
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [title, content, tags, isModified, isNewNote, handleSave]);

  const handleCancel = useCallback(() => {
    if (isModified) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [isModified, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "Enter":
            e.preventDefault();
            handleSave();
            break;
          case "Escape":
            e.preventDefault();
            handleCancel();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [title, content, tags, handleCancel, handleSave]);

  const handleDelete = async () => {
    if (!currentNote) return;
    try {
      await deleteNote({ id: noteId });
      toast.success(
        <div className="flex items-center gap-2">
          <Trash2 className="size-4" />
          <span>Note deleted successfully</span>
        </div>
      );
      navigate("/");
    } catch (error) {
      console.error("Failed to delete note", error);
      toast.error("Failed to delete note");
    }
  };

  const handleArchive = async () => {
    if (!currentNote) return;

    try {
      await toggleArchive({ id: noteId });
      toast.success(
        <div className="flex items-center gap-2">
          <Archive className="size-4" />
          <span>
            {currentNote.isArchived ? "Note unarchived" : "Note archived"}
          </span>
        </div>
      );
      navigate("/");
    } catch (error) {
      console.error("Failed to archive note", error);
      toast.error("Failed to archive note");
    }
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    setIsModified(true);
  };

  const handleContentChange = (value) => {
    setContent(value);
    setIsModified(true);
  };

  const handleTagsChange = (value) => {
    setTags(value);
    setIsModified(true);
  };

  const ToolbarButton = ({ onClick, isActive, children, title, toolName }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        onClick();
        setActiveTool(toolName);
        setTimeout(() => setActiveTool(null), 300);
      }}
      title={title}
      type="button"
      className={cn(
        "h-8 w-8 p-0 rounded-lg transition-all duration-300 relative overflow-hidden group",
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="gap-2 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {isModified && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
              >
                <Clock className="size-3 mr-1" />
                Modified
              </Badge>
            )}
            <Button
              onClick={() => handleSave()}
              disabled={isSaving || !title.trim()}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg rounded-xl transition-all duration-300"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="size-4" />
                  Save
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop header with sticky toolbar */}
      <div className="hidden md:block border-b border-gray-200/50 bg-white/80 backdrop-blur-sm relative z-10 sticky top-0">
        {/* Main Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-2 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300 group"
                >
                  <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Go Back
                </Button>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    <Edit3 className="size-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {isNewNote
                        ? "Create New Note"
                        : `${currentNote?.title || "Edit Note"}`}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      {isModified && (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                        >
                          <Clock className="size-3 mr-1" />
                          Modified
                        </Badge>
                      )}
                      {lastSaved && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Zap className="size-3 text-green-500" />
                          Saved{" "}
                          {formatDistanceToNow(lastSaved, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isNewNote && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleArchive}
                      size="sm"
                      className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50/80 rounded-xl transition-all duration-300 group"
                    >
                      <Archive className="size-4 group-hover:scale-110 transition-transform duration-300" />
                      {currentNote?.isArchived ? "Unarchive" : "Archive"}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-red-200 text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-300 group"
                        >
                          <Trash2 className="size-4 group-hover:scale-110 transition-transform duration-300" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="size-5" />
                            Delete Note
                          </DialogTitle>
                          <DialogDescription className="text-gray-600">
                            This action cannot be undone. The note will be
                            permanently deleted from your account.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex items-center gap-3">
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="rounded-xl border-gray-300"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 border-0 shadow-lg"
                          >
                            <Trash2 className="size-4" />
                            Delete Note
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                <Button
                  variant="outline"
                  onClick={handleCancel}
                  size="sm"
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
                >
                  <RotateCcw className="size-4" />
                  Cancel
                </Button>

                <Button
                  onClick={() => handleSave()}
                  disabled={isSaving || !title.trim()}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="size-4" />
                      Save Note
                      <kbd className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                        Ctrl+S
                      </kbd>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Editor Toolbar */}
        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-1 flex-wrap">
              {/* Text Formatting */}
              <div className="flex items-center gap-1 mr-2">
                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleBold()
                      .run()
                  }
                  isActive={editorRef.current?.getEditor()?.isActive("bold")}
                  title="Bold (Ctrl+B)"
                  toolName="bold"
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleItalic()
                      .run()
                  }
                  isActive={editorRef.current?.getEditor()?.isActive("italic")}
                  title="Italic (Ctrl+I)"
                  toolName="italic"
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleUnderline()
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("underline")}
                  title="Underline"
                  toolName="underline"
                >
                  <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleStrike()
                      .run()
                  }
                  isActive={editorRef.current?.getEditor()?.isActive("strike")}
                  title="Strikethrough"
                  toolName="strike"
                >
                  <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleCode()
                      .run()
                  }
                  isActive={editorRef.current?.getEditor()?.isActive("code")}
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
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleHeading({ level: 1 })
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("heading", { level: 1 })}
                  title="Heading 1"
                  toolName="h1"
                >
                  <Heading1 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleHeading({ level: 2 })
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("heading", { level: 2 })}
                  title="Heading 2"
                  toolName="h2"
                >
                  <Heading2 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleHeading({ level: 3 })
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("heading", { level: 3 })}
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
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleBulletList()
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("bulletList")}
                  title="Bullet List"
                  toolName="bullet"
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleOrderedList()
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("orderedList")}
                  title="Numbered List"
                  toolName="ordered"
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current
                      ?.getEditor()
                      ?.chain()
                      .focus()
                      .toggleBlockquote()
                      .run()
                  }
                  isActive={editorRef.current
                    ?.getEditor()
                    ?.isActive("blockquote")}
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
                  onClick={() =>
                    editorRef.current?.getEditor()?.chain().focus().undo().run()
                  }
                  title="Undo (Ctrl+Z)"
                  toolName="undo"
                >
                  <Undo className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editorRef.current?.getEditor()?.chain().focus().redo().run()
                  }
                  title="Redo (Ctrl+Y)"
                  toolName="redo"
                >
                  <Redo className="h-4 w-4" />
                </ToolbarButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Title */}
          <div className="space-y-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter a captivating title..."
              className="!text-3xl !font-bold border-0 px-0 py-2 shadow-none focus:outline-none !focus:ring-0 !focus:border-0 placeholder:text-gray-400 bg-transparent"
              autoFocus
            />
          </div>

          {/* Tags */}
          <div className="space-y-3 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <Label
              htmlFor="tags"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Tag className="size-4 text-blue-500" />
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="react, javascript, notes, ideas..."
              className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 rounded-xl py-3 transition-all duration-300"
            />
            <p className="text-xs text-gray-500 flex items-center gap-1">
              Separate tags with commas for better organization
            </p>
          </div>

          {/* Content */}
          <div className="space-y-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
            <div className="px-6 pt-6">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Edit3 className="size-4 text-blue-500" />
                Content
              </Label>
            </div>
            <div className="border-0 rounded-b-2xl overflow-hidden min-h-96">
              <TipTapEditor
                ref={editorRef}
                content={content}
                onChange={handleContentChange}
                placeholder="Start writing your thoughts... Let your creativity flow ✨"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="size-4 text-amber-500" />
              <span>Auto-saves every 2 seconds</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="size-4 text-purple-500" />
              <span>Use Ctrl+S to save instantly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
