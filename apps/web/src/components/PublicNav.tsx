import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/50 bg-[#080810]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PayGate" className="w-7 h-7 object-contain" />
          <span className="text-lg font-bold tracking-tight text-white">PayGate</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/guide"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Developer Guide
            </Link>
          </div>
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-900/20">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
