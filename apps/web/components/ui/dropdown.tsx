"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, children, align = "right" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 mt-2 w-48 rounded-xl bg-[#262D35] border border-border shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200",
            align === "right" ? "right-0" : "left-0"
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "danger";
}

export function DropdownItem({ children, onClick, className, variant = "default" }: DropdownItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-bold cursor-pointer transition-colors mx-2 rounded-lg",
        variant === "default" 
          ? "text-text-secondary hover:bg-white/5 hover:text-white" 
          : "text-red-400 hover:bg-red-500/10 hover:text-red-500",
        className
      )}
    >
      {children}
    </div>
  );
}
