// /src/components/InviteButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function InviteButton() {
  const router = useRouter();

  const createRoom = () => {
    const roomId = crypto.randomUUID(); // unique id
    const url = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(url);
    alert("Invite link copied! Share it with collaborators.");
    router.push(`/${roomId}`);
  };

  return (
    <button
      onClick={createRoom}
      className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
    >
      Invite collaborators
    </button>
  );
}
