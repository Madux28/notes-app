// DONE

import { UserButton, useUser } from "@clerk/clerk-react";
import {
  ArrowLeft,
  User,
  Palette,
  Type,
  Settings as SettingsIcon,
  Sparkles,
  Zap,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");

  const colorThemes = [
    {
      value: "blue",
      label: "Ocean Blue",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      preview: "from-blue-500 to-cyan-500",
    },
    {
      value: "green",
      label: "Emerald",
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      preview: "from-green-500 to-emerald-500",
    },
    {
      value: "purple",
      label: "Royal Purple",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      preview: "from-purple-500 to-pink-500",
    },
    {
      value: "orange",
      label: "Sunset",
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      preview: "from-orange-500 to-red-500",
    },
    {
      value: "red",
      label: "Crimson",
      color: "bg-gradient-to-br from-red-500 to-rose-500",
      preview: "from-red-500 to-rose-500",
    },
    {
      value: "pink",
      label: "Blossom",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      preview: "from-pink-500 to-rose-500",
    },
    {
      value: "teal",
      label: "Aqua",
      color: "bg-gradient-to-br from-teal-500 to-cyan-500",
      preview: "from-teal-500 to-cyan-500",
    },
    {
      value: "yellow",
      label: "Golden",
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      preview: "from-yellow-500 to-amber-500",
    },
    {
      value: "indigo",
      label: "Deep Space",
      color: "bg-gradient-to-br from-indigo-500 to-purple-500",
      preview: "from-indigo-500 to-purple-500",
    },
    {
      value: "cyan",
      label: "Ice",
      color: "bg-gradient-to-br from-cyan-500 to-blue-500",
      preview: "from-cyan-500 to-blue-500",
    },
    {
      value: "slate",
      label: "Graphite",
      color: "bg-gradient-to-br from-slate-600 to-gray-600",
      preview: "from-slate-600 to-gray-600",
    },
  ];

  const fontThemes = [
    {
      value: "inter",
      label: "Inter",
      className: "font-sans",
      description: "Modern and clean",
    },
    {
      value: "roboto",
      label: "Roboto",
      className: "font-sans",
      description: "Google's classic",
    },
    {
      value: "poppins",
      label: "Poppins",
      className: "font-sans",
      description: "Geometric and elegant",
    },
    {
      value: "geist",
      label: "Geist",
      className: "font-geist",
      description: "Vercel's modern font",
    },
    {
      value: "catamaran",
      label: "Catamaran",
      className: "font-catamaran",
      description: "Warm and friendly",
    },
    {
      value: "mono",
      label: "Monospace",
      className: "font-mono",
      description: "Developer friendly",
    },
  ];

  const appearanceModes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Bright and clean",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      value: "auto",
      label: "Auto",
      icon: Monitor,
      description: "System preference",
    },
  ];

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "profile", label: "Profile", icon: User },
    { id: "advanced", label: "Advanced", icon: SettingsIcon },
  ];

  const handleColorThemeChange = async (value) => {
    try {
      await setTheme({ colorTheme: value });
      toast.success(
        <div className="flex items-center gap-2">
          <Palette className="size-4" />
          <span>
            Color theme updated to{" "}
            {colorThemes.find((t) => t.value === value)?.label}
          </span>
        </div>
      );
    } catch {
      toast.error("Failed to update theme");
    }
  };

  const handleFontThemeChange = async (value) => {
    try {
      await setTheme({ fontTheme: value });
      toast.success(
        <div className="flex items-center gap-2">
          <Type className="size-4" />
          <span>
            Font updated to {fontThemes.find((t) => t.value === value)?.label}
          </span>
        </div>
      );
    } catch {
      toast.error("Failed to update theme");
    }
  };

  const handleAppearanceModeChange = async (value) => {
    try {
      await setTheme({ appearanceMode: value });
      toast.success(
        <div className="flex items-center gap-2">
          {value === "light" ? (
            <Sun className="size-4" />
          ) : value === "dark" ? (
            <Moon className="size-4" />
          ) : (
            <Monitor className="size-4" />
          )}
          <span>Appearance set to {value}</span>
        </div>
      );
    } catch {
      toast.error("Failed to update appearance");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20 overflow-auto relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Notes
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <SettingsIcon className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Customize your Notes.io experience
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <Sparkles className="size-3 mr-1" />
                Pro
              </Badge>
              <UserButton />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 p-1 bg-white/50 rounded-2xl border border-gray-200/50 w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`gap-2 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main settings area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                {/* Appearance Mode */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <Monitor className="size-5 text-blue-600" />
                      Appearance Mode
                    </CardTitle>
                    <CardDescription>
                      Choose how Notes.io looks on your device
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup
                      value={theme.appearanceMode || "light"}
                      onValueChange={handleAppearanceModeChange}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {appearanceModes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <div key={mode.value} className="relative">
                            <RadioGroupItem
                              value={mode.value}
                              id={`mode-${mode.value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`mode-${mode.value}`}
                              className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                theme.appearanceMode === mode.value
                                  ? "border-blue-500 bg-blue-50/50 shadow-md"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                              }`}
                            >
                              <Icon
                                className={`size-8 mb-2 ${
                                  theme.appearanceMode === mode.value
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="font-medium text-gray-900">
                                {mode.label}
                              </span>
                              <span className="text-sm text-gray-500 text-center mt-1">
                                {mode.description}
                              </span>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Color Theme */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <Palette className="size-5 text-purple-600" />
                      Color Theme
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred color scheme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup
                      value={theme.colorTheme}
                      onValueChange={handleColorThemeChange}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {colorThemes.map((colorTheme) => (
                        <div key={colorTheme.value} className="relative">
                          <RadioGroupItem
                            value={colorTheme.value}
                            id={`color-${colorTheme.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`color-${colorTheme.value}`}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              theme.colorTheme === colorTheme.value
                                ? "border-blue-500 bg-blue-50/50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-lg ${colorTheme.color} shadow-inner mb-2`}
                            />
                            <span className="font-medium text-gray-900 text-sm">
                              {colorTheme.label}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Font Theme */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <Type className="size-5 text-green-600" />
                      Font Theme
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred font family
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup
                      value={theme.fontTheme}
                      onValueChange={handleFontThemeChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {fontThemes.map((fontTheme) => (
                        <div key={fontTheme.value} className="relative">
                          <RadioGroupItem
                            value={fontTheme.value}
                            id={`font-${fontTheme.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`font-${fontTheme.value}`}
                            className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              theme.fontTheme === fontTheme.value
                                ? "border-blue-500 bg-blue-50/50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                            } ${fontTheme.className}`}
                          >
                            <span className="font-semibold text-gray-900 text-lg">
                              {fontTheme.label}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                              {fontTheme.description}
                            </span>
                            <div className="mt-2 text-xs text-gray-400">
                              Aa Bb Cc Dd Ee Ff
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <User className="size-5 text-blue-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                        <User className="size-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user?.fullName || "Anonymous User"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user?.emailAddresses?.[0]?.emailAddress}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900">
                            {user?.fullName || "Not set"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Primary Email
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900">
                            {user?.emailAddresses?.[0]?.emailAddress}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Zap className="size-4 text-amber-500" />
                      <span>
                        Manage your account details through Clerk dashboard
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advanced Settings */}
            {activeTab === "advanced" && (
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <SettingsIcon className="size-5 text-gray-600" />
                    Advanced Settings
                  </CardTitle>
                  <CardDescription>
                    Additional options and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Keyboard Shortcuts
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use Ctrl+K to view all available keyboard shortcuts for
                        faster navigation.
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                      <h4 className="font-semibold text-amber-900 mb-2">
                        Coming Soon
                      </h4>
                      <p className="text-sm text-amber-700">
                        More advanced settings and customization options are in
                        development.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200/50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Sparkles className="size-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200/50">
                    <Zap className="size-4 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">
                      Changes apply instantly across the app
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200/50">
                    <Palette className="size-4 text-purple-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">
                      Try different color themes to match your style
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200/50">
                    <Type className="size-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">
                      Font changes affect readability and feel
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Theme Preview */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200/50">
                <CardTitle className="text-purple-900 text-sm">
                  Current Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Color</span>
                    <Badge variant="outline" className="bg-white">
                      {
                        colorThemes.find((t) => t.value === theme.colorTheme)
                          ?.label
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Font</span>
                    <Badge variant="outline" className="bg-white">
                      {
                        fontThemes.find((t) => t.value === theme.fontTheme)
                          ?.label
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Appearance</span>
                    <Badge variant="outline" className="bg-white capitalize">
                      {theme.appearanceMode || "light"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
