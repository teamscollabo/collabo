// POST { language, version?, code, stdin?, args? }
export const runtime = "nodejs";

type ExecBody = {
  language: string;
  version?: string;  // semver or exact (e.g., "3.12.4"); "*" selects latest on self-hosts
  code: string;
  stdin?: string;
  args?: string[];
};

function extFromLang(lang: string) {
  const map: Record<string, string> = {
    python: "py", javascript: "js", node: "js", nodejs: "js", ts: "ts", typescript: "ts",
    c: "c", cpp: "cpp", cplusplus: "cpp", java: "java", go: "go", rust: "rs",
    ruby: "rb", php: "php", bash: "sh", sh: "sh", kotlin: "kt", swift: "swift", scala: "scala",
  };
  return map[lang.toLowerCase()] ?? "txt";
}

export async function POST(req: Request) {
  let body: ExecBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
  }

  const { language, version, code, stdin, args } = body;
  if (!language || !code) {
    return new Response(JSON.stringify({ message: "language and code are required" }), { status: 400 });
  }

  const payload = {
    language,
    version: version || "*",
    files: [{ name: `Main.${extFromLang(language)}`, content: code }],
    stdin: stdin ?? "",
    args: Array.isArray(args) ? args : [],
    compile_timeout: 10_000,
    run_timeout: 3_000,
    // You can optionally set run_memory_limit / compile_memory_limit here
  };

  const res = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}
