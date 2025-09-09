"use client";

import { useEffect, useRef, useState } from "react";

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

export default function InviteDialog({ open, onClose, url }: InviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Autofocus & select URL on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.select(), 50);
    else setCopied(false);
  }, [open]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      inputRef.current?.select(); // fallback
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join my collab room", url });
      } catch {
        /* user canceled */
      }
    } else {
      copyToClipboard();
    }
  };

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // click outside to close
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative w-[92%] max-w-lg rounded-2xl border border-white/10 bg-[#161129]/90 backdrop-blur p-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-20 blur-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">Invite collaborators</h2>
            <p className="mt-1 text-sm text-gray-400">
              Share this link and anyone can join your live coding session.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/10 transition"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3a1 1 0 1 0-1.4 1.4L10.83 12l-5.13 4.9a1 1 0 1 0 1.4 1.4L12 14.83l4.9 5.13a1 1 0 0 0 1.4-1.4L13.17 12l5.13-4.9Z"/>
            </svg>
          </button>
        </div>

        {/* URL field */}
        <div className="mt-4 flex items-stretch gap-2">
          <input
            ref={inputRef}
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />

          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 active:scale-[0.99] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z"/>
            </svg>
            Copy
          </button>

          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-white/15 active:scale-[0.99] transition"
            title="Share"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor">
              <path d="M18 8a3 3 0 1 0-2.8-4h2.1A1.9 1.9 0 1 1 19.2 6 1.9 1.9 0 0 1 17.3 8H18ZM6 13a3 3 0 1 0 2.8 4H6.7A1.9 1.9 0 1 1 4.8 15 1.9 1.9 0 0 1 6.7 13H6Zm9.6-7.8-7.9 4.1.9 1.8 7.8-4.1-.8-1.8Zm-7 7.7-.9 1.8 7.9 4.1.8-1.8-7.8-4.1Z"/>
            </svg>
            Share
          </button>
        </div>

        {/* Tip */}
        <div className="mt-3 text-xs text-gray-400">
          Anyone with the link can view and edit this room in real time.
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>

        {/* Copied toast */}
        <div
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${
            copied ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          } bottom-4 transition duration-200`}
        >
          <div className="rounded-full bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 shadow">
            Link copied!
          </div>
        </div>
      </div>
    </div>
  );
}
