"use client";

import { useRef, useEffect } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { CODE_SNIPPETS, type Language } from "../constants/constants";
import Output from "./Output";
import {ResizableHandle,ResizablePanel,ResizablePanelGroup,} from "@/components/ui/resizable"

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

  useEffect(() => {
    // 1. Initialize Yjs Doc and Provider
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(roomId, doc, {
    signaling: ['wss://signaling-server-afah.onrender.com/ws']
});

    ydocRef.current = doc;
    providerRef.current = provider;

    const yText = doc.getText("monaco");
    const yMeta = doc.getMap("meta");

    const awareness = provider.awareness;

    // 2. Check and coordinate snippet insertion
    // Listen for changes in other users' awareness state
    // awareness.on("change", () => {
    //   const awarenessStates = Array.from(awareness.getStates().values());
    //   const isSomeoneInserting = awarenessStates.some(
    //     (state) => state.status === "inserting-snippet"
    //   );

    //   // If the editor is empty and no one else is inserting, this client can be the one to do it
    //   if (yText.length === 0 && !yMeta.get("initialized") && !isSomeoneInserting) {
    //     // Set awareness state to indicate that this client is inserting the snippet
    //     awareness.setLocalStateField("status", "inserting-snippet");

    //     // Perform the insertion
    //     yText.insert(0, CODE_SNIPPETS[language]);
    //     yMeta.set("initialized", true);

    //     // Clear awareness status after insertion
    //     awareness.setLocalStateField("status", null);
    //   }
    // });

    // 3. Cleanup function
    return () => {
      // Destroy the provider and doc on component unmount to prevent memory leaks
      provider.destroy();
      doc.destroy();
    };
  }, [roomId, language]); // Dependency array ensures this effect runs once

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    const doc = ydocRef.current;
    const provider = providerRef.current;

    if (doc && provider) {
      const yText = doc.getText("monaco");

      // Bind the Yjs document to the Monaco editor
      import("y-monaco").then(({ MonacoBinding }) => {
        new MonacoBinding(
          yText,
          editor.getModel()!,
          new Set([editor]),
          provider.awareness
        );
      });
    }
  };

  return (
     <ResizablePanelGroup direction="horizontal" className="h-[75vh]">
      <ResizablePanel defaultSize={50} minSize={20}>
        <Editor
          options={{ minimap: { enabled: false } }}
          height="100%"
          theme="vs-dark"
          language={language}
          onMount={onMount}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} minSize={20}>
        <Output editorRef={editorRef} language={language} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodeEditor;