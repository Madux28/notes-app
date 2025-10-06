// DONE

import { useState } from "react";
import {
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Share2,
  Sparkles,
  Zap,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ShareDialog({ open, onOpenChange, note }) {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState(null);

  // Later, generate a public shareable link
  const shareUrl = `${window.location.origin}/shared/${note._id}`;
  const shareText = `Check out this note: ${note.title}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="size-4 text-green-500" />
          <span>Link copied to clipboard!</span>
        </div>
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-red-500" />
          <span>Failed to copy link</span>
        </div>
      );
    }
  };

  const shareOnSocial = (platform) => {
    setActivePlatform(platform);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }

    setTimeout(() => setActivePlatform(null), 1000);
  };

  const socialPlatforms = [
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      hoverColor: "hover:from-blue-500 hover:to-blue-700",
      textColor: "text-blue-600",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-700 hover:to-blue-900",
      textColor: "text-blue-600",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-gradient-to-br from-blue-700 to-blue-900",
      hoverColor: "hover:from-blue-800 hover:to-blue-950",
      textColor: "text-blue-700",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Share2 className="size-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Share Note
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Share this note with others via link or social media
              </DialogDescription>
            </div>
          </div>

          {/* Note Preview */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Sparkles className="size-4 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {note.title || "Untitled Note"}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {note.content
                    ? `${note.content.replace(/<[^>]*>/g, "").substring(0, 60)}...`
                    : "No content"}
                </p>
              </div>
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                <Users className="size-3 mr-1" />
                Share
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link className="size-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Shareable Link
              </span>
            </div>

            <div className="flex items-center gap-2 p-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 border-0 bg-white/80 backdrop-blur-sm focus:ring-0 focus:ring-offset-0 rounded-xl"
              />

              <Button
                onClick={copyToClipboard}
                className={cn(
                  "gap-2 rounded-xl transition-all duration-300 transform",
                  copied
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                )}
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Zap className="size-3" />
              Anyone with this link can view this note
            </p>
          </div>

          {/* Social Sharing Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="size-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Share on Social Media
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const isActive = activePlatform === platform.id;

                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    onClick={() => shareOnSocial(platform.id)}
                    className={cn(
                      "flex flex-col gap-2 h-16 rounded-xl border-2 transition-all duration-300 transform hover:scale-105",
                      isActive
                        ? "border-blue-500 bg-blue-50/50 shadow-md scale-105"
                        : "border-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        platform.color,
                        isActive && "scale-110"
                      )}
                    >
                      <Icon className="size-4 text-white" />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium transition-colors duration-300",
                        isActive ? "text-blue-600" : "text-gray-600"
                      )}
                    >
                      {platform.name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50">
            <div className="flex items-start gap-3">
              <Sparkles className="size-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900">
                  Sharing Tips
                </p>
                <p className="text-xs text-amber-700">
                  Shared notes are read-only. Collaborators cannot edit the
                  original content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
