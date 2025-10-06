// DONE

import { useState } from "react";
import { useMutation } from "convex/react";
import {
  Archive,
  Trash2,
  Share,
  MoreVertical,
  Pencil,
  Clock,
  Tag,
  User,
  Sparkles,
  Download,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { api } from "../../convex/_generated/api";
import ShareDialog from "./ShareDialog";
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

export default function NotePreview({ note, onEdit }) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const toggleArchive = useMutation(api.notes.toggleArchiveNote);
  const deleteNote = useMutation(api.notes.deleteNote);

  const formatDate = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const handleArchive = async () => {
    try {
      await toggleArchive({ id: note._id });
      toast.success(
        <div className="flex items-center gap-2">
          <Archive className="size-4" />
          <span>Note {note.isArchived ? "unarchived" : "archived"}</span>
        </div>
      );
    } catch {
      toast.error("Failed to archive note");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote({ id: note._id });
      toast.success(
        <div className="flex items-center gap-2">
          <Trash2 className="size-4" />
          <span>Note deleted successfully</span>
        </div>
      );
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleCopyContent = async () => {
    try {
      setIsCopying(true);
      const plainText = note.content.replace(/<[^>]*>/g, "").trim();
      await navigator.clipboard.writeText(plainText);
      toast.success("Content copied to clipboard");
    } catch {
      toast.error("Failed to copy content");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Title with gradient */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 break-words leading-tight">
                {note.title || "Untitled Note"}
              </h1>

              {/* Metadata cards */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Tags card */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <Tag className="size-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Tags
                    </span>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {note.tags?.length > 0 ? (
                        note.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500/15 to-teal-500/15 text-blue-700 border-blue-200/50 hover:from-blue-500/25 hover:to-teal-500/25 transition-all duration-300"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No tags</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Last edited card */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
                  <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                    <Clock className="size-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Last edited
                    </span>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {formatDate(note.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Status card */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
                  <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <User className="size-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Status
                    </span>
                    <p className="text-sm text-gray-600 mt-0.5 capitalize">
                      {note.isArchived ? (
                        <span className="text-amber-600 font-medium">
                          Archived
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50/80 rounded-xl transition-all duration-300 group"
                title="Edit note"
              >
                <Pencil className="size-4 group-hover:scale-110 transition-transform duration-300" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50/80 rounded-xl transition-all duration-300 group"
                title="Share note"
              >
                <Share className="size-4 group-hover:scale-110 transition-transform duration-300" />
                Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300 group"
                  >
                    <MoreVertical className="size-4 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl p-2 min-w-48"
                >
                  <DropdownMenuItem
                    onClick={handleArchive}
                    className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-amber-50/80 text-amber-700 mb-1"
                  >
                    <Archive className="size-4" />
                    {note.isArchived ? "Unarchive Note" : "Archive Note"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleCopyContent}
                    disabled={isCopying}
                    className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-50/80 text-blue-700 mb-1"
                  >
                    {isCopying ? (
                      <div className="size-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    Copy Content
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-gray-200/50" />

                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-red-50/80 text-red-600 text-sm font-medium">
                        <Trash2 className="size-4" />
                        Delete Note
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                          <Trash2 className="size-5" />
                          Delete Note
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                          This action cannot be undone. The note "
                          {note.title || "Untitled"}" will be permanently
                          deleted from your account.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex items-center gap-3 mt-4">
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
            <div
              className="p-8 prose prose-gray max-w-none leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  note.content ||
                  `
                  <div class="text-center py-16 text-gray-500">
                    <div class="size-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="size-8 text-gray-400" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">No Content Yet</h3>
                    <p class="text-gray-500">This note doesn't have any content. Start writing to bring it to life!</p>
                    <Button onClick={onEdit} className="mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                      <Pencil className="size-4 mr-2" />
                      Start Writing
                    </Button>
                  </div>
                `,
              }}
            />
          </div>

          {/* Quick stats */}
          {note.content && (
            <div className="flex items-center justify-center gap-6 mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {note.content.split(" ").length}
                </div>
                <div className="text-xs text-gray-500">words</div>
              </div>
              <div className="w-px h-8 bg-gray-300/50"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {note.content.replace(/<[^>]*>/g, "").length}
                </div>
                <div className="text-xs text-gray-500">characters</div>
              </div>
              <div className="w-px h-8 bg-gray-300/50"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.ceil(note.content.split(" ").length / 200)}
                </div>
                <div className="text-xs text-gray-500">min read</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        note={note}
      />
    </div>
  );
}
