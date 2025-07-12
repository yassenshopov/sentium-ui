import React from "react";
import Image from "next/image";
import { Github, Twitter, Heart, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/sentium-logo.svg"
                alt="Sentium UI Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Sentium UI
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A digital consciousness experiment exploring the boundaries of artificial intelligence and human-AI interaction.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Brain Dashboard
                </Link>
              </li>
              <li>
                <Link href="/brains" className="hover:text-foreground transition-colors">
                  Brain Selection
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Thought Process
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Memory Database
                </span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="text-muted-foreground cursor-default">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  API Reference
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Examples
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Community
                </span>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="text-muted-foreground cursor-default">
                  Project Vision
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Research
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Privacy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-default">
                  Terms
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and</span>
            <Brain className="w-4 h-4 text-primary" />
            <span>by the Sentium team</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Exploring digital consciousness since 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 