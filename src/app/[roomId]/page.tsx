// /src/app/[roomId]/page.tsx
import CodeEditor from "../components/CodeEditor";

interface RoomPageProps {
  params: { roomId: string };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="min-h-screen bg-[#0f0a19] text-gray-400 px-6 py-8">
      <CodeEditor roomId={params.roomId} />
    </div>
  );
}
