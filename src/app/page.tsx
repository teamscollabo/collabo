"use client";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const createRoom = (lang: string) => {
    const roomId = uuidv4();
    // Navigate to /[language]/[roomId]
    router.push(`/${lang}/${roomId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0a19] text-gray-300 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to the Collaborative Code Editor</h1>
      <p className="text-lg">Choose a language to start coding together:</p>

      <div className="flex space-x-6">
        <button
          onClick={() => createRoom("javascript")}
          className="px-6 py-3 bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          JavaScript
        </button>
        <button
          onClick={() => createRoom("python")}
          className="px-6 py-3 bg-green-600 rounded-lg shadow hover:bg-green-700"
        >
          Python
        </button>
        <button
          onClick={() => createRoom("java")}
          className="px-6 py-3 bg-red-600 rounded-lg shadow hover:bg-red-700"
        >
          Java
        </button>
      </div>
    </div>
  );
}
