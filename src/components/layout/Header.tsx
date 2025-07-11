import React from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Docs", href: "#" },
  { label: "Components", href: "#" },
  { label: "Blocks", href: "#" },
  { label: "Themes", href: "#" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Left: Logo/Title */}
        <span className="flex items-center gap-2 select-none">
          <Image
            src="/sentium-logo.svg"
            alt="Sentium UI Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">Sentium UI</span>
        </span>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              {link.label}
            </a>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ThemeToggle />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="text-center">
                <p>Toggle dark/light mode</p>
                <p className="text-xs text-muted-foreground mt-1">Ctrl+Shift+L</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </nav>
        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
                <Menu className="h-6 w-6 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0 flex flex-col border-l border-border bg-background">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="flex items-center gap-2">
                  <Image
                    src="/sentium-logo.svg"
                    alt="Sentium UI Logo"
                    width={36}
                    height={36}
                    className="h-9 w-9"
                  />
                  <span className="text-lg font-bold">Sentium UI</span>
                </span>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-muted focus:outline-none">
                    <X className="h-6 w-6" />
                  </button>
                </SheetTrigger>
              </div>
              <nav className="flex flex-col gap-1 px-4 py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-2 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 