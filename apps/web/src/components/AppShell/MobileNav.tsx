"use client";

import { useState } from "react";
import Link from "next/Link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Settings, 
  LogOut,
  Globe,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function MobileNav({ walletAddress }: { walletAddress: string }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const closeMenu = () => setIsOpen(false);

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-teal-400 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-sm font-bold text-white">PG</span>
          </div>
          <span className="text-xl font-bold tracking-tight">PayGate</span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-zinc-400">
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-50 p-4 shadow-xl flex flex-col gap-2">
          <nav className="flex flex-col space-y-1 mb-4">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href) && 
                (link.href !== "/directory" || pathname === "/directory");
                
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
            <p className="text-xs font-mono text-zinc-400 truncate px-2 text-center">
              {walletAddress}
            </p>
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
