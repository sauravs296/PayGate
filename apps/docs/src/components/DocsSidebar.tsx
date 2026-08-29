"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Settings, 
  Zap, 
  Terminal,
  ChevronRight,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", href: "/", icon: BookOpen },
      { title: "Features & Architecture", href: "/features", icon: Zap },
    ],
  },
  {
    title: "Getting Started",
    items: [
      { title: "Developer Setup", href: "/setup", icon: Settings },
      { title: "Usage & Consumption", href: "/usage", icon: Terminal },
      { title: "Smart Contracts", href: "/contracts", icon: Shield },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-zinc-800 bg-[#080810] h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-2 text-violet-400 font-semibold mb-8">
          <BookOpen className="w-5 h-5" />
          PayGate Docs
        </div>
        <nav className="space-y-8">
          {NAV_ITEMS.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-violet-500/10 text-violet-300 font-medium border border-violet-500/20"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.title}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-violet-500" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
