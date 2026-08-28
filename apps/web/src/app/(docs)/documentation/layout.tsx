import { PublicNav } from "@/components/PublicNav";
import { DocsSidebar } from "@/components/DocsSidebar";

export const metadata = {
  title: "Documentation — PayGate",
  description: "Complete documentation for the PayGate protocol.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080810] text-zinc-50 flex flex-col font-sans">
      <PublicNav />
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto">
        <DocsSidebar />
        <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12 md:py-16">
          <div className="max-w-3xl prose prose-invert prose-violet">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
