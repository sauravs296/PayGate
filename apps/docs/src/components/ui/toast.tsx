"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

const ICONS: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const STYLES: Record<ToastVariant, { border: string; icon: string; title: string }> = {
  success: {
    border: "border-emerald-500/40",
    icon: "bg-emerald-500/20 text-emerald-400",
    title: "text-emerald-300",
  },
  error: {
    border: "border-red-500/40",
    icon: "bg-red-500/20 text-red-400",
    title: "text-red-300",
  },
  info: {
    border: "border-violet-500/40",
    icon: "bg-violet-500/20 text-violet-400",
    title: "text-violet-300",
  },
  warning: {
    border: "border-amber-500/40",
    icon: "bg-amber-500/20 text-amber-400",
    title: "text-amber-300",
  },
};

function SingleToast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Slide in
    const enterTimer = setTimeout(() => setVisible(true), 16);
    // Auto-dismiss
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(item.id), 400);
    }, item.duration ?? 5000);

    return () => {
      clearTimeout(enterTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.id, item.duration, onDismiss]);

  const s = STYLES[item.variant];

  return (
    <div
      role="alert"
      aria-live="assertive"
      onClick={() => {
        setVisible(false);
        setTimeout(() => onDismiss(item.id), 400);
      }}
      style={{
        transform: visible ? "translateX(0)" : "translateX(calc(100% + 1.5rem))",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
      }}
      className={`
        flex items-start gap-3 cursor-pointer select-none
        w-80 max-w-[calc(100vw-2rem)]
        rounded-xl border ${s.border}
        bg-[#12121a]/90 backdrop-blur-xl
        px-4 py-3.5 shadow-2xl shadow-black/50
      `}
    >
      {/* Icon */}
      <span
        className={`
          mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center
          rounded-full text-xs font-bold ${s.icon}
        `}
      >
        {ICONS[item.variant]}
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-snug ${s.title}`}>
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed break-words">
            {item.description}
          </p>
        )}
      </div>

      {/* Dismiss × */}
      <button
        className="mt-0.5 flex-shrink-0 text-zinc-500 hover:text-zinc-200 transition-colors text-sm leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...opts, id }]);
  }, []);

  const success = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "success" }),
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "error" }),
    [toast]
  );
  const info = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "info" }),
    [toast]
  );
  const warning = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "warning" }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* Portal: fixed top-right stack */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SingleToast item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

