"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      default: "bg-primary text-white hover:opacity-90 shadow-xl shadow-primary/20",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200/50",
      outline: "border-2 border-border bg-transparent hover:bg-white/5 text-white",
      secondary: "bg-accent text-base hover:opacity-90 shadow-xl shadow-accent/20",
      ghost: "hover:bg-white/5 text-white",
      link: "text-accent underline-offset-8 hover:underline font-black uppercase tracking-widest text-[10px]",
    };

    const sizes = {
      default: "h-12 px-6 py-3 text-sm",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-14 rounded-xl px-8 text-base",
      icon: "h-12 w-12",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-black uppercase tracking-[0.1em] ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 active:scale-[0.95] hover:translate-y-[-1px] hover:shadow-xl",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
