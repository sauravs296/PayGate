"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Settings, 
  LogOut,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AppSidebar({ walletAddress }: { walletAddress: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/apis", label: "My APIs", icon: TerminalSquare },
    { href: "/directory", label: "Directory", icon: Globe },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const truncateWallet = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
          <Image src="/logo.png" alt="PayGate Logo" width={32} height={32} className="object-contain w-full h-full" priority />
        </div>
        <span className="text-xl font-bold tracking-tight">PayGate</span>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href) && 
            (link.href !== "/directory" || pathname === "/directory");
            
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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

      <div className="pt-6 border-t border-zinc-800/50 mt-auto">
        <div className="px-3 mb-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Connected Wallet</p>
          <p className="text-sm font-mono text-zinc-300 bg-zinc-900 py-1.5 px-2 rounded-md border border-zinc-800 overflow-hidden text-ellipsis">
            {truncateWallet(walletAddress)}
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

