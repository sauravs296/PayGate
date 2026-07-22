"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProfileAction, type UpdateProfileState } from "@/server/actions/profile-actions";
import { useToast } from "@/components/ui/toast-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  Wallet,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useTransition } from "react";

interface SettingsFormProps {
  stellarWallet: string;
  email: string | null;
  developerId: string;
  createdAt: Date;
}

export function SettingsForm({
  stellarWallet,
  email,
  developerId,
  createdAt,
}: SettingsFormProps) {
  const [state, formAction] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    null
  );
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  // dismissedState tracks which action result was dismissed by the user
  const [dismissedState, setDismissedState] = useState<UpdateProfileState>(null);
  const showBanner = state !== null && state !== dismissedState;

  // Fire top-right toast whenever a new action result arrives
  const prevStateRef = useRef<UpdateProfileState>(null);
  useEffect(() => {
    if (state !== null && state !== prevStateRef.current) {
      prevStateRef.current = state;
      if (state.success) {
        showToast("success", "Profile Updated", "Your email has been saved successfully.");
      } else {
        showToast("error", "Update Failed", state.message);
      }
    }
  }, [state, showToast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(stellarWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Settings</h1>
        <p className="text-zinc-400 mt-2">
          Manage your account identity and notification preferences.
        </p>
      </div>

      {/* ── Account Identity Card ─────────────────────────────────────────── */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-zinc-100">Connected Wallet</CardTitle>
              <CardDescription className="text-zinc-500 text-sm mt-0.5">
                Your Stellar wallet is your permanent identity on PayGate.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Wallet address */}
          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm font-medium">
              Wallet Address
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 min-w-0">
                <span className="font-mono text-sm text-violet-300 truncate flex-1">
                  {stellarWallet}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="border-zinc-700 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white shrink-0 transition-all"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-teal-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-zinc-600">
              All API earnings are settled directly to this address on Stellar.
            </p>
          </div>

          {/* Account meta */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-600 mb-1 uppercase tracking-wider font-medium">
                Developer ID
              </p>
              <p className="font-mono text-xs text-zinc-500 truncate" title={developerId}>
                {developerId.slice(0, 20)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-600 mb-1 uppercase tracking-wider font-medium">
                Member Since
              </p>
              <p className="text-sm text-zinc-400">{joinDate}</p>
            </div>
          </div>

          {/* Verified badge */}
          <div className="flex items-center gap-2 bg-teal-500/5 border border-teal-500/15 rounded-xl px-4 py-3">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <p className="text-sm text-teal-300 font-medium">
              Wallet ownership verified via cryptographic signature
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Profile Details Card ──────────────────────────────────────────── */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <CardTitle className="text-zinc-100">Profile Details</CardTitle>
              <CardDescription className="text-zinc-500 text-sm mt-0.5">
                Optional contact information for account notifications.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status banner */}
          {showBanner && state && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                state.success
                  ? "border-teal-500/25 bg-teal-500/8 text-teal-300"
                  : "border-red-500/25 bg-red-500/8 text-red-300"
              }`}
            >
              {state.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              )}
              <span className="flex-1">{state.message}</span>
              <button
                onClick={() => setDismissedState(state)}
                className="text-zinc-500 hover:text-zinc-300 text-xs ml-2 shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          <form
            action={async (formData: FormData) => {
              startTransition(() => {
                formAction(formData);
              });
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email || ""}
                placeholder="you@example.com"
                className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 focus-visible:border-violet-500"
              />
              <p className="text-xs text-zinc-600">
                Used for API earnings summaries and important account alerts.
                Never shared with third parties.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-zinc-600">
                {email
                  ? `Currently saved: ${email}`
                  : "No email on file yet."}
              </p>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-900/20 transition-all min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Danger Zone Card ──────────────────────────────────────────────── */}
      <Card className="bg-zinc-900 border-red-900/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-red-400 text-base">Danger Zone</CardTitle>
          <CardDescription className="text-zinc-500 text-sm">
            Irreversible actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Disconnect Wallet
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Signs you out of your current session. Your data is preserved.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-red-800 text-red-400 hover:bg-red-900/20 hover:border-red-700 hover:text-red-300 shrink-0"
            >
              <a href="/api/auth/logout">Sign Out</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
