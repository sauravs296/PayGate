import { getSession } from "@/lib/auth/session";
import { getDeveloperByWallet } from "@/lib/db/developers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getSession();
  const developer = await getDeveloperByWallet(session.stellarWallet);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-400 mt-2">
          Manage your account and preferences.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Account Identity</CardTitle>
          <CardDescription className="text-zinc-400">
            Your Stellar wallet is your identity on PayGate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Connected Wallet Address</Label>
            <Input 
              readOnly 
              value={session.stellarWallet} 
              className="font-mono bg-zinc-950 border-zinc-800 text-zinc-400"
            />
            <p className="text-xs text-zinc-500">
              All API payments will be settled directly to this address.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription className="text-zinc-400">
            Optional information for notifications and communication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                defaultValue={developer?.email || ""} 
                placeholder="developer@example.com"
                className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500"
              />
            </div>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

