"use client";

import { useRef, useEffect } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { CODE_SNIPPETS, type Language } from "../constants/constants";
import Output from "./Output";

// Yjs + WebRTC imports
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

interface CodeEditorProps {
  roomId: string;      // required now
  language: Language;  // required now
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId, language }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);

  const onMount: OnMount = async (editor) => {
    editorRef.current = editor;
    editor.focus();

    // Dynamically import y-monaco to avoid SSR issues
    const { MonacoBinding } = await import("y-monaco");

    if (!ydocRef.current) {
      const doc = new Y.Doc();
      const provider = new WebrtcProvider(roomId, doc);
      const yText = doc.getText("monaco");

      // Initialize shared text with snippet if empty
      if (yText.length === 0) {
        yText.insert(0, CODE_SNIPPETS[language]);
      }

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
          defaultValue={CODE_SNIPPETS[language]} // initial template
          onMount={onMount}
        />
      </div>

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
