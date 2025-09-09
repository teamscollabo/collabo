"use client";

import { useEffect, useState } from "react";
import InviteDialog from "./InviteDialog";

export default function InviteButton() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 active:scale-[0.99] transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor">
          <path d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5Zm6-1h4v2h-4v-2Zm5.2-4h-3v2h3a3 3 0 1 1 0 6h-3v2h3a5 5 0 0 0 0-10Z"/>
        </svg>
        Invite collaborators
      </button>

      <InviteDialog open={open} onClose={() => setOpen(false)} url={url} />
    </>
  );
}
