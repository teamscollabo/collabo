"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

type Runtime = { language: string; version: string; aliases: string[] };

const STARTER_SNIPPETS: Record<string, string> = {
  python: `print("Hello from Python!")`,
  javascript: `console.log("Hello from JavaScript!")`,
  c: `#include <stdio.h>
int main(){ printf("Hello from C!\\n"); return 0; }`,
  cpp: `#include <bits/stdc++.h>
using namespace std; int main(){ cout<<"Hello from C++!"<<endl; return 0; }`,
  java: `class Main { public static void main(String[] args){ System.out.println("Hello from Java!"); } }`,
  go: `package main
import "fmt"
func main(){ fmt.Println("Hello from Go!") }`,
  rust: `fn main(){ println!("Hello from Rust!"); }`,
};

function monacoIdFor(lang: string) {
  const map: Record<string, string> = {
    python: "python", javascript: "javascript", node: "javascript", nodejs: "javascript",
    typescript: "typescript", ts: "typescript", c: "c", cpp: "cpp", cplusplus: "cpp",
    java: "java", go: "go", rust: "rust", php: "php", ruby: "ruby",
    bash: "shell", sh: "shell", kotlin: "kotlin", swift: "swift", scala: "scala",
  };
  return map[lang.toLowerCase()] ?? "plaintext";
}

export default function Page() {
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [language, setLanguage] = useState<string>("python");
  const [version, setVersion] = useState<string>("*");
  const [stdin, setStdin] = useState<string>("");
  const [args, setArgs] = useState<string>("");
  const [code, setCode] = useState<string>(STARTER_SNIPPETS["python"]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/runtimes");
        const data = await res.json();
        setRuntimes(data);
        // Default to latest version for python if available
        const pyVersions = data.filter((r: Runtime) => r.language === "python").map((r: Runtime) => r.version);
        if (pyVersions.length) setVersion(pyVersions[pyVersions.length - 1]);
      } catch {
        // ignore
      }
    })();
  }, []);

  const versionsForLang = useMemo(
    () => runtimes.filter(r => r.language.toLowerCase() === language.toLowerCase()).map(r => r.version),
    [runtimes, language]
  );

  const onMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => handleRun());
  }, []);

  function changeLanguage(next: string) {
    setLanguage(next);
    const vlist = runtimes.filter(r => r.language.toLowerCase() === next.toLowerCase()).map(r => r.version);
    setVersion(vlist.length ? vlist[vlist.length - 1] : "*");
    setCode(STARTER_SNIPPETS[next] ?? "");
  }

  async function handleRun() {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          version,
          code,
          stdin,
          args: args.trim() ? args.split(/\s+/) : [],
        }),
      });
      const data = await res.json();
      setOutput(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 border-b flex flex-wrap gap-3 items-center">
        <strong className="text-lg">Piston Playground</strong>
        <div className="flex-grow" />
        <label className="text-sm mr-2">Language</label>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {Array.from(new Set(runtimes.map(r => r.language)))
            .sort()
            .map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
        </select>

        <label className="text-sm ml-3 mr-2">Version</label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {/* Allow "*" (latest) in case you self-host or prefer a selector */}
          <option value="*">*</option>
          {versionsForLang.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <button
          onClick={handleRun}
          disabled={loading}
          className="ml-3 border rounded px-3 py-1"
          title="Ctrl/Cmd + Enter"
        >
          {loading ? "Running…" : "Run ▶"}
        </button>
      </header>

      <main className="grid md:grid-cols-2 gap-0 flex-1">
        <div className="border-r">
          <Editor
            onMount={onMount}
            height="calc(100vh - 56px)"
            language={monacoIdFor(language)}
            value={code}
            onChange={(val) => setCode(val ?? "")}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="p-3 border-b">
            <div className="mb-2">
              <label className="text-sm block">stdin</label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full border rounded p-2 h-20"
                placeholder="Optional input passed to your program"
              />
            </div>
            <div>
              <label className="text-sm block">args (space-separated)</label>
              <input
                value={args}
                onChange={(e) => setArgs(e.target.value)}
                className="w-full border rounded p-2"
                placeholder='e.g. "1 2 3"'
              />
            </div>
          </div>

          <div className="p-3 overflow-auto">
            <h3 className="font-medium mb-2">Output</h3>
            {!output && <pre className="text-sm opacity-70">Run to see results…</pre>}
            {output?.compile && (
              <>
                <div className="text-xs font-semibold mb-1">Compile</div>
                <pre className="bg-black/80 text-green-200 p-2 rounded text-sm whitespace-pre-wrap">
{output.compile.output || (output.compile.stdout + output.compile.stderr)}
                </pre>
              </>
            )}
            {output?.run && (
              <>
                <div className="text-xs font-semibold mt-3 mb-1">Run</div>
                <pre className="bg-black/80 text-green-200 p-2 rounded text-sm whitespace-pre-wrap">
{output.run.output || (output.run.stdout + output.run.stderr)}
                </pre>
                <div className="text-xs mt-2 opacity-70">
                  exit code: {output.run.code} • wall: {output.run.wall_time ?? "?"}ms • cpu: {output.run.cpu_time ?? "?"}ms
                </div>
              </>
            )}
            {output?.message && (
              <pre className="bg-red-900/70 text-red-50 p-2 rounded text-sm whitespace-pre-wrap mt-3">
{output.message}
              </pre>
            )}
          </div>
        </div>
      </main>

      <footer className="px-4 py-2 border-t text-xs opacity-70">
        Powered by Monaco Editor and Piston public API.
      </footer>
    </div>
  );
}
