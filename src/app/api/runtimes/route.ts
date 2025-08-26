// Fetch Piston runtimes and cache for 1 hour
export const runtime = "nodejs";

export async function GET() {
  const res = await fetch("https://emkc.org/api/v2/piston/runtimes", {
    // Revalidate hourly to keep version list fresh
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ message: "Failed to load runtimes" }), { status: 500 });
  }
  const data = await res.json();
  return Response.json(data);
}
