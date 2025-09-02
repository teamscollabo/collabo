"use client";

import { useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, type Language } from "../constants/constants";
import Output from "./Output";

// Yjs + WebRTC imports
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

interface CodeEditorProps {
  roomId?: string; // pass from parent (landing or /[roomId])
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId = "landing" }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");

  // Keep doc/provider around for snippets + access
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);

  const onMount: OnMount = async (editor) => {
    editorRef.current = editor;
    editor.focus();

    // Dynamically import y-monaco to avoid SSR issues
    const { MonacoBinding } = await import("y-monaco");

    // Initialize Yjs + WebRTC only once
    if (!ydocRef.current) {
      const doc = new Y.Doc();
      const provider = new WebrtcProvider(roomId, doc); // 🔑 use roomId
      const yText = doc.getText("monaco");

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

  const onSelect = (lang: Language) => {
    setLanguage(lang);

    // Update shared Yjs text instead of React state
    const yText = ydocRef.current?.getText("monaco");
    if (yText) {
      yText.delete(0, yText.length);
      yText.insert(0, CODE_SNIPPETS[lang]);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <LanguageSelector language={language} onSelect={onSelect} />

        <Editor
          options={{ minimap: { enabled: false } }}
          height="75vh"
          theme="vs-dark"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
        />
      </div>

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
