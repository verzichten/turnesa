"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface SubMenuItem {
  label: string;
  href: string;
}

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  subItems?: SubMenuItem[];
}

export function SidebarNavItem({ icon: Icon, label, href, subItems }: SidebarNavItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isSubItemActive = subItems?.some(item => pathname === item.href);
  const isActive = href === pathname || isSubItemActive;

  const toggleOpen = (e: React.MouseEvent) => {
    if (subItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const content = (
    <div
      onClick={toggleOpen}
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer group",
        isActive ? "bg-primary text-white" : "hover:bg-white/5 text-[#D1D5DB]"
      )}
    >
      <div className="flex items-center gap-4">
        <Icon className={cn(
          "h-5 w-5 transition-colors",
          isActive ? "text-white" : "text-accent group-hover:text-white"
        )} />
        <span className="font-bold text-sm tracking-wide">{label}</span>
      </div>
      {subItems && (
        isOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />
      )}
    </div>
  );

  return (
    <div className="space-y-1">
      {href ? (
        <Link href={href}>{content}</Link>
      ) : (
        content
      )}

      {subItems && isOpen && (
        <div className="pl-12 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {subItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-accent",
                pathname === item.href ? "text-accent" : "text-[#D1D5DB]/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
