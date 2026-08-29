import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PayGate" className="w-7 h-7 object-contain grayscale" />
          <span className="text-lg font-bold tracking-tight text-white">PayGate Docs</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://github.com/sauravs296/PayGate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
