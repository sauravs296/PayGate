"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function MobileNav({ walletAddress, totalEarnings }: { walletAddress: string; totalEarnings?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { success } = useToast();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/apis", label: "My APIs", icon: TerminalSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
            <Image src="/logo.png" alt="PayGate Logo" width={32} height={32} className="object-contain w-full h-full" priority />
          </div>
          <span className="text-xl font-bold tracking-tight">PayGate</span>
        </Link>
        
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-zinc-400">
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-50 p-4 shadow-xl flex flex-col gap-2">
          <nav className="flex flex-col space-y-1 mb-4">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
                
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-violet-600/10 text-violet-400" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Earned</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xl font-bold text-teal-400">
                    ${(totalEarnings || 0).toFixed(4)}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">USDC</span>
                </div>
                
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Connected Wallet</p>
                <div 
                  className="flex items-center justify-between bg-zinc-950 py-1.5 px-2.5 rounded-md border border-zinc-800 cursor-pointer hover:border-violet-500/50 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    success("Address copied to clipboard", "You can now paste it anywhere.");
                  }}
                  title="Copy Wallet Address"
                >
                  <span className="text-sm font-mono text-zinc-300">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 hover:text-violet-400 transition-colors"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full text-zinc-300 border-zinc-700 bg-transparent hover:bg-zinc-800"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

