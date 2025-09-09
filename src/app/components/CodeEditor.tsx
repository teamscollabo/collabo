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
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId, language }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);

  const onMount: OnMount = async (editor) => {
    editorRef.current = editor;
    editor.focus();

    const { MonacoBinding } = await import("y-monaco");

    if (!ydocRef.current) {
      const doc = new Y.Doc();
      const provider = new WebrtcProvider(roomId, doc, {
        signaling: ["ws://localhost:4444"], // use your signaling server
      });

      const yText = doc.getText("monaco");
      const yMeta = doc.getMap("meta"); // shared metadata map

      // Insert snippet only if the room hasn't been initialized
      if (!yMeta.get("initialized") && yText.length === 0) {
        console.log("Inserting snippet for the first time (creator only)");
        yText.insert(0, CODE_SNIPPETS[language]);
        yMeta.set("initialized", true);
      }

      // Optional: log when synced with other peers
      provider.on("synced", (isSynced) => {
        console.log("synced event fired! isSynced =", isSynced, "yText length:", yText.length);
      });

      // Bind Yjs text to Monaco editor
      new MonacoBinding(
        yText,
        editor.getModel()!,
        new Set([editor]),
        provider.awareness
      );

      ydocRef.current = doc;
      providerRef.current = provider;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <Editor
          options={{ minimap: { enabled: false } }}
          height="75vh"
          theme="vs-dark"
          language={language}
          onMount={onMount}
        />
      </div>

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
