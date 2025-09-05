"use client";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { LANGUAGE_VERSIONS, type Language } from "./constants/constants";

export default function HomePage() {
  const router = useRouter();

  const createRoom = (lang: Language) => {
    const roomId = uuidv4();
    // Navigate to /[language]/[roomId]
    router.push(`/${lang}/${roomId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0a19] text-gray-300 space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome to the Collaborative Code Editor
      </h1>
      <p className="text-lg">Choose a language to start coding together:</p>

      <div className="flex space-x-6 flex-wrap justify-center">
        {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
          <button
            key={lang}
            onClick={() => createRoom(lang as Language)}
            className="px-6 py-3 bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
