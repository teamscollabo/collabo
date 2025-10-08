// src/app/[language]/[roomId]/page.tsx

import CodeEditor from "../../components/CodeEditor";
import InviteButton from "../../components/InviteButton";
import { type Language } from "../../constants/constants";

interface RoomPageProps {
  params: Promise<{ language: string; roomId: string }>;
}

const ALLOWED_LANGUAGES = ["javascript", "typescript", "python", "java", "csharp", "php"] as const;

export default async function RoomPage({ params }: RoomPageProps) {
  const { language, roomId } = await params;

  // Validate the language from the route
  if (!ALLOWED_LANGUAGES.includes(language as Language)) {
    return <div className="text-red-500">Invalid language: {language}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0a19] text-gray-400 px-6 py-8">
      <div className="flex items-center pb-4">
        <InviteButton/>
      </div>
      <CodeEditor roomId={roomId} language={language as Language} />
    </div>
  );
}
