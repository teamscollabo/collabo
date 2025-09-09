"use client";

import { useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { CODE_SNIPPETS, type Language } from "../constants/constants";
import Output from "./Output";

// Yjs + WebRTC imports
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

interface CodeEditorProps {
  roomId: string;
  language: Language;
  initSnippet?: boolean;        // true only for creator tab (?init=1)
  showInviteButton?: boolean;   // header handles the button; default true for reuse if needed
}

const LANG_BADGE: Record<Language, string> = {
  javascript: "from-yellow-400 to-orange-500",
  typescript: "from-sky-400 to-blue-600",
  python: "from-emerald-400 to-teal-600",
  java: "from-red-400 to-rose-600",
  csharp: "from-indigo-400 to-violet-600",
  php: "from-fuchsia-400 to-pink-600",
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  roomId,
  language,
  initSnippet,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);

  const shortRoom = `${roomId.slice(0, 4)}…${roomId.slice(-4)}`;

  const onMount: OnMount = async (editor) => {
    editorRef.current = editor;
    editor.focus();

    // Dynamically import y-monaco to avoid SSR issues
    const { MonacoBinding } = await import("y-monaco");

    if (!ydocRef.current) {
      const doc = new Y.Doc();
      // language + roomId to keep rooms isolated per language
      
      const provider = new WebrtcProvider(roomId, doc, {
              signaling: ["ws://localhost:4444"], // use your signaling server
            });
      const yText = doc.getText("monaco");
      const meta = doc.getMap("meta");

      // Bind first so remote content appears immediately
      new MonacoBinding(yText, editor.getModel()!, new Set([editor]), provider.awareness);

      // seed exactly once: creator tab only, after sync, if truly empty
      const localKey = `room-init:${language}-${roomId}`;
      const alreadyLocal = typeof window !== "undefined" && localStorage.getItem(localKey) === "1";

      provider.on("synced", (isSynced: boolean) => {
        if (isSynced && initSnippet && !alreadyLocal && !meta.get("initialized") && yText.length === 0) {
          yText.insert(0, CODE_SNIPPETS[language]);
          meta.set("initialized", true);
          try { localStorage.setItem(localKey, "1"); } catch {}
        }
      });

      ydocRef.current = doc;
      providerRef.current = provider;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Toolbar (no Invite here to avoid duplicates) */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#151026]/80 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${LANG_BADGE[language]} px-3 py-1 text-xs font-semibold text-black/90 capitalize`}
          >
            {language}
          </span>
          <span className="text-xs text-gray-400">Room: {shortRoom}</span>
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor card */}
        <div className="rounded-2xl border border-white/10 bg-[#151026] shadow overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-300">Editor</h3>
          </div>
          <div className="h-[70vh]">
            <Editor
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontLigatures: true,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
              height="100%"
              theme="vs-dark"
              language={language}
              // IMPORTANT: let Yjs control content; do NOT inject templates here
              defaultValue=""
              onMount={onMount}
            />
          </div>
        </div>

        {/* Output card */}
        <div className="rounded-2xl border border-white/10 bg-[#151026] shadow overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-300">Output</h3>
          </div>
          <div className="p-3 grow">
            <div className="rounded-lg bg-black/30 border border-white/10 p-3 h-full overflow-auto">
              <Output editorRef={editorRef} language={language} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-[11px] text-gray-500 text-center">
        Powered by Monaco, Yjs (WebRTC), and Piston.
      </div>
    </div>
  );
};

export default CodeEditor;

