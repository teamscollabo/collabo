"use client";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { LANGUAGE_VERSIONS, type Language } from "./constants/constants"

const LANG_STYLES: Record<string, string> = {
  javascript: "from-yellow-400 to-orange-500",
  typescript: "from-sky-400 to-blue-600",
  python: "from-emerald-400 to-teal-600",
  java: "from-red-400 to-rose-600",
  csharp: "from-indigo-400 to-violet-600",
  php: "from-fuchsia-400 to-pink-600",
};

export default function HomePage() {
  const router = useRouter();

  const createRoom = (lang: Language) => {
    const roomId = uuidv4();
    router.push(`/${lang}/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0a19] text-gray-200">
      {/* Top nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-[#0f0a19]/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600" />
            <span className="text-lg font-bold tracking-tight">Collab IDE</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            className="text-sm text-gray-400 hover:text-gray-200 transition"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Code together. In any language.
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Pick a language to spin up a real-time collaborative room.
            Share the link, and start building together instantly.
          </p>
        </section>

        {/* Language grid */}
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(LANGUAGE_VERSIONS).map((langKey) => {
              const lang = langKey as Language;
              const gradient = LANG_STYLES[lang] ?? "from-zinc-500 to-zinc-700";
              return (
                <button
                  key={lang}
                  onClick={() => createRoom(lang)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151026] p-5 text-left transition hover:shadow-xl hover:border-white/20"
                >
                  <div
                    className={`pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-30 blur-2xl transition group-hover:opacity-50`}
                  />
                  <div
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold text-black/90`}
                  >
                    {lang}
                    <span className="opacity-70">
                      v{LANGUAGE_VERSIONS[lang]}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold capitalize">
                    {lang}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Start a room with the {lang} starter template and invite collaborators.
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-gray-300 font-medium">Create room</span>
                    <span className="text-gray-400 group-hover:translate-x-1 transition">
                      ↗
                    </span>
                  </div>

                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradient} opacity-0 transition group-hover:opacity-100`}
                  />
                </button>
              );
            })}
          </div>
        </section>

        <footer className="mt-14 text-center text-xs text-gray-500">
          Built with Next.js, Monaco, Yjs, and WebRTC.
        </footer>
      </main>
    </div>
  );
}
