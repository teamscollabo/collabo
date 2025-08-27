'use client'

import { useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, type Language } from "../constants/constants";
import Output from "./Output";

const CodeEditor: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<Language>("javascript");

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (lang: Language) => {
    setLanguage(lang);
    setValue(CODE_SNIPPETS[lang]);
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
          value={value}
          onChange={(val) => setValue(val ?? "")}
        />
      </div>

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
