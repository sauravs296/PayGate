import { getSession } from "@/lib/auth/session";
import { getApisByDeveloper } from "@/lib/db/apis";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import Link from "next/link";

export default async function ApisPage() {
  const session = await getSession();
  const apis = await getApisByDeveloper(session.developerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My APIs</h1>
          <p className="text-zinc-400 mt-2">
            Manage your registered paywalled endpoints.
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto">
          <Link href="/apis/new">
            <Plus className="mr-2 h-4 w-4" />
            Add API
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-900/80">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Slug</TableHead>
                <TableHead className="text-zinc-400">Price (USDC)</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Total Calls</TableHead>
                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apis.length === 0 ? (
                <TableRow className="border-zinc-800">
                  <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                    No APIs registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                apis.map((api) => (
                  <TableRow key={api.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-medium text-zinc-200">
                      <Link href={`/apis/${api.id}`} className="hover:text-violet-400 transition-colors">
                        {api.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-400">
                      /{api.slug}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {api.priceUsdc.toString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={api.isActive ? "default" : "secondary"} className={api.isActive ? "bg-teal-500/10 text-teal-400" : "bg-zinc-800"}>
                        {api.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {api._count.calls}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                        <Link href={`/apis/${api.id}/edit`}>
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Edit {api.name}</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

