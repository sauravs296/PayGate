import { PublicNav } from "@/components/PublicNav";
import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  Code2,
  Zap,
  Shield,
  CheckCircle2,
  Terminal,
  Globe,
  ChevronRight,
  BookOpen,
  Coins,
  Network,
  Play,
  Lock,
  Unlock,
  RefreshCw,
  Database,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Developer Guide — PayGate",
  description:
    "A step-by-step guide to understanding and using PayGate — pay-per-call APIs powered by x402 and Stellar.",
};

const TIMELINE_STEPS = [
  {
    id: "01",
    icon: AlertCircle,
    color: "red",
    title: "The Old Way — What's Broken",
    duration: "The Problem",
  },
  {
    id: "02",
    icon: Network,
    color: "blue",
    title: "x402 — The New Internet Standard",
    duration: "The Protocol",
  },
  {
    id: "03",
    icon: Globe,
    color: "teal",
    title: "Stellar & USDC — The Money Layer",
    duration: "The Blockchain",
  },
  {
    id: "04",
    icon: Shield,
    color: "violet",
    title: "PayGate — The Middleware",
    duration: "The Platform",
  },
  {
    id: "05",
    icon: Code2,
    color: "amber",
    title: "List Your API as a Developer",
    duration: "For Builders",
  },
  {
    id: "06",
    icon: Zap,
    color: "teal",
    title: "Call a Paid API as a Consumer",
    duration: "For Callers",
  },
];

export default function WalkthroughPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-zinc-50 font-sans">
      <PublicNav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-medium text-teal-300 mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Developer Guide
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-6 leading-tight">
            How PayGate Works,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
              From Zero to First Call
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            No blockchain experience required. This guide walks you through
            every concept — from the problem with API keys to your first
            micropayment settling on Stellar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            {["~10 min read", "Beginner-friendly", "No setup required"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Table of Contents ─────────────────────────────────────────────── */}
      <section className="py-10 px-4 border-y border-zinc-800/50 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-5">
            In this walkthrough
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TIMELINE_STEPS.map((step) => (
              <a
                key={step.id}
                href={`#step-${step.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group"
              >
                <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
                  {step.id}
                </span>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  {step.duration}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 ml-auto shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-20 space-y-24">

        {/* ── STEP 01: The Problem ────────────────────────────────────────── */}
        <section id="step-01" className="scroll-mt-24">
          <StepBadge number="01" label="The Problem" color="red" />
          <h2 className="text-3xl font-bold mt-4 mb-2">
            Why API Keys &amp; Subscriptions Are Broken
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Before we understand PayGate, we need to understand the problem it
            solves. Imagine you&apos;re building an app that needs weather data.
            Here&apos;s what the old world looks like:
          </p>

          <div className="relative">
            {/* Flow diagram */}
            <div className="space-y-3">
              {[
                {
                  icon: "🌐",
                  text: 'You find a Weather API you want',
                  sub: "Great! They charge $0.001 per call",
                },
                {
                  icon: "📝",
                  text: "Sign up, verify your email, fill a form",
                  sub: "Just to try it once",
                },
                {
                  icon: "💳",
                  text: "Enter your credit card",
                  sub: "They require a $10/month minimum",
                },
                {
                  icon: "🔑",
                  text: "Get an API key — store it securely",
                  sub: "Hope it never leaks or expires",
                },
                {
                  icon: "📊",
                  text: "Track usage manually",
                  sub: "Hope you don't exceed your plan",
                },
                {
                  icon: "😩",
                  text: "Do this 20x for 20 different APIs",
                  sub: "For every service your app needs",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    {i < 5 && (
                      <div className="w-px h-5 bg-red-500/20 mt-1" />
                    )}
                  </div>
                  <div className="pt-1.5 pb-3">
                    <p className="font-medium text-zinc-200">{item.text}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CalloutBox type="problem" className="mt-8">
            <strong className="text-red-300">The real problem for AI Agents:</strong> An
            AI agent browsing the web autonomously <em>cannot</em> sign up for
            15 different subscriptions, manage 15 API keys, or enter a credit
            card number. The existing model is fundamentally incompatible with
            the agentic internet.
          </CalloutBox>
        </section>

        <Divider />

        {/* ── STEP 02: x402 Protocol ─────────────────────────────────────── */}
        <section id="step-02" className="scroll-mt-24">
          <StepBadge number="02" label="The Protocol" color="blue" />
          <h2 className="text-3xl font-bold mt-4 mb-2">
            x402 — The HTTP Status Code That Was Forgotten
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Here&apos;s something wild: the HTTP specification has had a{" "}
            <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded text-sm">
              402 Payment Required
            </code>{" "}
            status code since <strong>1999</strong>. It was designed for
            exactly this use case — paying for internet resources on-demand. But
            it was never used because there was no internet-native money yet.
          </p>

          <div className="bg-zinc-900/60 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <p className="text-sm text-zinc-500 uppercase tracking-wider font-mono mb-3">
              How x402 Works — Request/Response Flow
            </p>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 pt-0.5">1.</span>
                <div>
                  <p className="text-teal-300">
                    Client → GET /api/x/weather-london
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Normal request, no payment yet
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 pt-0.5">2.</span>
                <div>
                  <p className="text-red-300">Server → 402 Payment Required</p>
                  <p className="text-zinc-400 text-xs mt-1">
                    X-Payment-Required: {"{"}&quot;amount&quot;:&quot;0.001&quot;, &quot;currency&quot;:&quot;USDC&quot;,
                    &quot;dest&quot;:&quot;G...wallet&quot;{"}"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 pt-0.5">3.</span>
                <div>
                  <p className="text-amber-300">
                    Client signs a Stellar micropayment
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Wallet creates a transaction for exactly $0.001 USDC
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 pt-0.5">4.</span>
                <div>
                  <p className="text-teal-300">
                    Client → GET /api/x/weather-london
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">
                    X-Payment: {"{"}&quot;signature&quot;:&quot;abc123...&quot;{"}"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 pt-0.5">5.</span>
                <div>
                  <p className="text-green-300">
                    Server → 200 OK + weather data
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Payment verified, request proxied, developer earns USDC
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CalloutBox type="insight">
            <strong className="text-blue-300">Think of it like a vending machine:</strong>{" "}
            Instead of a monthly subscription, you pay a coin per item. The
            machine verifies your coin and gives you exactly what you asked for.
            x402 is the protocol that standardizes this for any HTTP API.
          </CalloutBox>
        </section>

        <Divider />

        {/* ── STEP 03: Stellar & USDC ────────────────────────────────────── */}
        <section id="step-03" className="scroll-mt-24">
          <StepBadge number="03" label="The Blockchain" color="teal" />
          <h2 className="text-3xl font-bold mt-4 mb-2">
            Why Stellar? Why USDC?
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            For API micropayments to work, the money layer needs to be
            fast, cheap, and stable. Here&apos;s why PayGate chose Stellar and
            USDC specifically:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: "⚡",
                title: "~5 second finality",
                desc: "Stellar settles transactions in under 5 seconds. Ethereum takes minutes. You can't make an API wait that long.",
                color: "teal",
              },
              {
                icon: "🪙",
                title: "Near-zero fees",
                desc: "Each Stellar transaction costs $0.0000001. Paying $0.001 for an API call doesn't work if the gas fee is $0.01.",
                color: "teal",
              },
              {
                icon: "💵",
                title: "USDC — Stable value",
                desc: "Developers earn in USDC (USD Coin), not volatile crypto. $0.001 today is $0.001 tomorrow.",
                color: "violet",
              },
              {
                icon: "📜",
                title: "Soroban smart contracts",
                desc: "Stellar's Soroban smart contract platform verifies each payment on-chain, making the entire flow trustless.",
                color: "violet",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-zinc-100 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
            <p className="text-sm font-medium text-zinc-300 mb-3">
              🌐 What is a Stellar wallet?
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A Stellar wallet is like your bank account on the blockchain — but
              you own the private key (no bank involved). It&apos;s identified by a
              public address like{" "}
              <code className="text-teal-300 text-xs bg-teal-500/10 px-1 rounded">
                GBZXN7PIRZGNMHGA7...
              </code>
              . When you connect your wallet to PayGate, we can see your address
              but we <strong>never</strong> have access to your private key. You
              sign transactions locally on your device.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── STEP 04: PayGate Middleware ────────────────────────────────── */}
        <section id="step-04" className="scroll-mt-24">
          <StepBadge number="04" label="The Platform" color="violet" />
          <h2 className="text-3xl font-bold mt-4 mb-2">
            PayGate — The Middleware That Connects Everything
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Building all of the above from scratch would take months. PayGate is
            a hosted proxy that handles the entire x402 flow for you. Think of
            it as a smart gateway that sits in front of any existing API.
          </p>

          {/* Architecture diagram */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8 overflow-x-auto">
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-6">
              Architecture Overview
            </p>
            <div className="flex items-center justify-center gap-3 min-w-[600px] flex-wrap">
              <ArchBox icon={<Globe className="w-4 h-4" />} label="Your API" sub="Any HTTP endpoint" color="zinc" />
              <ArchArrow label="registers" />
              <ArchBox icon={<Shield className="w-4 h-4" />} label="PayGate" sub="Payment gateway" color="violet" highlight />
              <ArchArrow label="issues" />
              <ArchBox icon={<Lock className="w-4 h-4" />} label="Paywalled URL" sub="paygate.app/api/x/..." color="zinc" />
              <div className="w-full flex justify-center mt-4 mb-2">
                <div className="w-px h-6 bg-zinc-700" />
              </div>
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3">
                <ArchBox icon={<Zap className="w-4 h-4" />} label="AI Agent / App" sub="Sends request + payment" color="teal" />
                <ArchArrow label="hits" />
                <ArchBox icon={<Shield className="w-4 h-4" />} label="PayGate" sub="Verifies payment on Stellar" color="violet" highlight />
                <ArchArrow label="proxies to" />
                <ArchBox icon={<Globe className="w-4 h-4" />} label="Your API" sub="Gets clean request" color="zinc" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Lock className="w-5 h-5 text-violet-400" />,
                title: "Payment Interception",
                desc: "PayGate intercepts every request, checks for a valid x402 payment signature before forwarding.",
              },
              {
                icon: <RefreshCw className="w-5 h-5 text-teal-400" />,
                title: "On-chain Verification",
                desc: "The Stellar transaction is verified against our Soroban smart contract in real time.",
              },
              {
                icon: <Database className="w-5 h-5 text-amber-400" />,
                title: "Instant Earnings",
                desc: "USDC goes directly to the developer's Stellar wallet. No escrow, no delays.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-semibold text-zinc-100 mb-1.5 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── STEP 05: Developer Walkthrough ────────────────────────────── */}
        <section id="step-05" className="scroll-mt-24">
          <StepBadge number="05" label="For Builders" color="amber" />
          <h2 className="text-3xl font-bold mt-4 mb-2">
            How to List Your API on PayGate
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            You already have an API. Maybe it&apos;s a weather endpoint, a data
            aggregator, or an AI model. Here&apos;s how you turn it into a paid
            service in under 5 minutes — no code changes needed.
          </p>

          <div className="space-y-4">
            {[
              {
                step: 1,
                icon: <Wallet className="w-5 h-5" />,
                title: "Connect Your Stellar Wallet",
                desc: "Click \"Get Started\" on the top right. You'll be asked to sign a challenge message with your Stellar wallet. This proves you own the wallet address — we never store your private key.",
                code: null,
                tip: "Don't have a Stellar wallet? You can create one free at stellar.org or use any compatible wallet like Freighter.",
              },
              {
                step: 2,
                icon: <Terminal className="w-5 h-5" />,
                title: "Register Your API Endpoint",
                desc: "In your dashboard, click \"New API\". Fill in a name, description, your existing API's URL, and the price you want to charge per call in USDC.",
                code: `Name: Weather API London
URL: https://your-backend.com/weather
Price: 0.001 USDC per call
Visibility: Public`,
                tip: "Your real API URL is kept private. Callers only ever see the PayGate endpoint.",
              },
              {
                step: 3,
                icon: <Unlock className="w-5 h-5" />,
                title: "Get Your Paywalled Endpoint",
                desc: "PayGate instantly generates a public endpoint for you. Share this URL — it's the one callers will use. Every request through it will require a valid Stellar micropayment.",
                code: `https://paygate.app/api/x/weather-london`,
                tip: null,
              },
              {
                step: 4,
                icon: <Coins className="w-5 h-5" />,
                title: "Start Earning USDC",
                desc: "That's it! Every time someone calls your endpoint with a valid x402 payment, the USDC is sent to your Stellar wallet instantly. Check your dashboard for real-time analytics and earnings.",
                code: null,
                tip: "Earnings are visible in your dashboard. You can withdraw to any exchange or wallet that supports Stellar USDC.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-amber-500">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-zinc-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                    {item.code && (
                      <pre className="mt-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-violet-300 overflow-x-auto">
                        {item.code}
                      </pre>
                    )}
                    {item.tip && (
                      <div className="mt-3 flex items-start gap-2 text-xs text-teal-400/80 bg-teal-500/5 border border-teal-500/15 rounded-lg p-3">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {item.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── STEP 06: Consumer Walkthrough ─────────────────────────────── */}
        <section id="step-06" className="scroll-mt-24">
          <StepBadge number="06" label="For Callers" color="teal" />
          <h2 className="text-3xl font-bold mt-4 mb-2">
            How to Call a Paid API
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Whether you&apos;re building an app or an AI agent, consuming a PayGate
            API requires just two things: an x402-compatible client and a funded
            Stellar wallet. No signup. No API key. Pay only for what you use.
          </p>

          <div className="space-y-4">
            {[
              {
                step: 1,
                icon: <Play className="w-5 h-5" />,
                title: "Try It Live — No Setup Needed",
                desc: "Go to the Marketplace and click \"Try in Playground\" on any API. Our playground environment has a pre-funded test wallet — you can see the full x402 payment flow happen in real time with zero setup.",
                code: null,
                action: { label: "Open Marketplace", href: "/marketplace" },
                color: "teal",
              },
              {
                step: 2,
                icon: <Wallet className="w-5 h-5" />,
                title: "Fund Your Stellar Wallet",
                desc: "For production use, you need a Stellar wallet funded with USDC on testnet. You can get free testnet USDC using Stellar's Friendbot, or use real USDC on mainnet.",
                code: `# Fund your testnet wallet (free)
curl "https://friendbot-testnet.stellar.org?addr=YOUR_WALLET_ADDRESS"`,
                action: null,
                color: "teal",
              },
              {
                step: 3,
                icon: <Code2 className="w-5 h-5" />,
                title: "Install the x402 Client",
                desc: "Use the open-source x402 client SDK. It wraps your standard fetch() calls and automatically handles the 402 payment negotiation in the background.",
                code: `npm install x402-fetch

import { wrapFetch } from 'x402-fetch';
import { Keypair } from '@stellar/stellar-sdk';

// Your Stellar wallet keypair
const keypair = Keypair.fromSecret('YOUR_SECRET_KEY');
const fetch402 = wrapFetch(fetch, keypair);

// Make a normal API call — payment happens automatically
const res = await fetch402('https://paygate.app/api/x/weather-london');
const data = await res.json();
console.log(data); // { temp: 18, condition: "Cloudy" }`,
                action: null,
                color: "teal",
              },
              {
                step: 4,
                icon: <CheckCircle2 className="w-5 h-5" />,
                title: "Behind the Scenes",
                desc: "Here's what happens automatically when you call fetch402():",
                bullets: [
                  "Your client sends a normal GET request",
                  "PayGate responds with 402 + payment details",
                  "The x402 client builds a $0.001 USDC Stellar transaction",
                  "Signs it with your wallet's private key (locally — never sent to us)",
                  "Retries the request with the payment signature in the header",
                  "PayGate verifies the signature on Stellar's blockchain",
                  "Your request is proxied to the real API",
                  "You receive the response data instantly",
                ],
                code: null,
                action: null,
                color: "teal",
              },
            ].map((item: {
              step: number;
              icon: React.ReactNode;
              title: string;
              desc: string;
              code?: string | null;
              action?: { label: string; href: string } | null;
              color: string;
              bullets?: string[];
            }) => (
              <div
                key={item.step}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-teal-500">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-zinc-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                    {"bullets" in item && item.bullets && (
                      <ul className="mt-3 space-y-1.5">
                        {item.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.code && (
                      <pre className="mt-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-violet-300 overflow-x-auto whitespace-pre-wrap">
                        {item.code}
                      </pre>
                    )}
                    {item.action && (
                      <div className="mt-4">
                        <Button
                          asChild
                          size="sm"
                          className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30"
                        >
                          <Link href={item.action.href}>
                            {item.action.label}{" "}
                            <ArrowRight className="ml-2 w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Summary / Recap ────────────────────────────────────────────── */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            You&apos;re all caught up!
          </div>
          <h2 className="text-3xl font-bold">
            The Full Picture in 6 Bullets
          </h2>
          <div className="max-w-2xl mx-auto text-left space-y-3">
            {[
              "API keys and subscriptions are a broken model for the agentic internet",
              "The x402 protocol revives HTTP 402 as a machine-readable payment standard",
              "Stellar is the ideal money rail — fast, cheap, and supports stable USDC",
              "PayGate is a hosted proxy that wraps any existing API with x402 payments",
              "Developers list their API, set a price, and earn USDC per call — no code changes",
              "Callers use the x402-fetch SDK to pay micropayments automatically with any wallet",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-mono text-violet-400 shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/30 to-zinc-900/50 p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Try It?</h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Explore the live marketplace to see real APIs in action, or connect
            your wallet and list your first API — it takes 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white shadow-xl shadow-violet-500/20 px-8"
            >
              <Link href="/login">
                Connect Wallet &amp; Start <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8"
            >
              <Link href="/marketplace">
                Browse APIs <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

// ── Helper components ───────────────────────────────────────────────────────

function StepBadge({
  number,
  label,
  color,
}: {
  number: string;
  label: string;
  color: "red" | "blue" | "teal" | "violet" | "amber";
}) {
  const colors = {
    red: "border-red-500/30 bg-red-500/10 text-red-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    teal: "border-teal-500/30 bg-teal-500/10 text-teal-300",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  };
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colors[color]}`}
    >
      <span className="font-mono">{number}</span>
      <span>{label}</span>
    </div>
  );
}

function CalloutBox({
  children,
  type,
  className = "",
}: {
  children: React.ReactNode;
  type: "problem" | "insight";
  className?: string;
}) {
  const styles =
    type === "problem"
      ? "border-red-500/20 bg-red-500/5 text-red-200/80"
      : "border-blue-500/20 bg-blue-500/5 text-blue-200/80";
  return (
    <div className={`border rounded-2xl p-5 text-sm leading-relaxed ${styles} ${className}`}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-800" />
      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-zinc-800" />
    </div>
  );
}

function ArchBox({
  icon,
  label,
  sub,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: "zinc" | "violet" | "teal";
  highlight?: boolean;
}) {
  const borders = {
    zinc: "border-zinc-700",
    violet: "border-violet-500/50",
    teal: "border-teal-500/50",
  };
  const icons = {
    zinc: "text-zinc-400",
    violet: "text-violet-400",
    teal: "text-teal-400",
  };
  return (
    <div
      className={`flex flex-col items-center gap-1.5 bg-zinc-900 border ${borders[color]} rounded-xl px-4 py-3 min-w-[110px] ${highlight ? "shadow-lg shadow-violet-500/10" : ""}`}
    >
      <span className={icons[color]}>{icon}</span>
      <span className="text-xs font-medium text-zinc-200">{label}</span>
      <span className="text-[10px] text-zinc-600 text-center">{sub}</span>
    </div>
  );
}

function ArchArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <span className="text-[10px] text-zinc-600">{label}</span>
      <ArrowRight className="w-4 h-4 text-zinc-700" />
    </div>
  );
}
