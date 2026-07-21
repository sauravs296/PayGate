import { getSession } from "@/lib/auth/session";
import { AppSidebar } from "@/components/AppShell/AppSidebar";
import { MobileNav } from "@/components/AppShell/MobileNav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If the user is logged in, show the standard dashboard sidebar layout
  if (session.isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row bg-zinc-950 text-zinc-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-64 border-r border-zinc-800 bg-zinc-900/50">
          <AppSidebar walletAddress={session.stellarWallet} />
        </div>

        {/* Mobile Top Nav */}
        <div className="md:hidden border-b border-zinc-800 bg-zinc-900/50">
          <MobileNav walletAddress={session.stellarWallet} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // If the user is NOT logged in, show a public top navigation bar
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-[#f0f0ff]">
      <header className="border-b border-zinc-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
              <Image src="/logo.png" alt="PayGate Logo" width={32} height={32} className="object-contain w-full h-full" priority />
            </div>
            <span className="text-lg font-bold tracking-tight">PayGate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Developer Login
            </Link>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-5 h-9">
              <Link href="/login">Submit API</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
