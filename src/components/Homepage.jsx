// DONE

import { Notebook, Sparkles, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { SignInButton } from "@clerk/clerk-react";
import hero from "../assets/hero.png";

export default function Homepage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <article className={`space-y-8 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Animated header with gradient text */}
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="relative">
                <Notebook className="size-16 text-teal-500 animate-bounce" />
                <Sparkles className="absolute -top-1 -right-1 size-4 text-yellow-500 animate-ping" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Madux Notes
              </h1>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-600">Modern Note-Taking Experience</span>
            </div>
          </div>

          {/* Enhanced description */}
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            <span className="font-semibold text-gray-800">Madux Notes</span> is a cutting-edge note-taking app built with the latest web technologies. 
            Organize your thoughts, boost productivity, and access your notes seamlessly across all devices.
          </p>

          {/* Built with badges */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {["React", "Vite", "Convex", "Clerk", "Tailwind"].map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Enhanced CTA section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button 
              className="group bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <SignInButton mode="modal">
                <div className="flex items-center gap-2">
                  Get started for free
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </SignInButton>
            </Button>
            
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-500">
                Built by{" "}
                <a 
                  href="/" 
                  className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-4 transition-colors duration-300"
                >
                  Madux Dev
                </a>
              </p>
            </div>
          </div>
        </article>

        {/* Hero image with modern styling */}
        <article className={`relative transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative group">
            {/* Floating card effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-2xl border border-white/20">
              <img 
                src={hero} 
                alt="Notes.io App Interface" 
                className="w-full h-auto rounded-lg shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce delay-1000"></div>
          </div>
        </article>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
}