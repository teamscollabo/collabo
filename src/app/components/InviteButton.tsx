// /src/components/InviteButton.tsx
"use client";

export default function InviteButton() {
  const copyLink = () => {
    const url = window.location.href; // current page URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert("Invite link copied! Share it with collaborators.");
      })
      .catch(() => {
        alert("Failed to copy link. Please copy it manually.");
      });
  };

  return (
    <button
      onClick={copyLink}
      className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
    >
      Invite collaborators
    </button>
  );
}
