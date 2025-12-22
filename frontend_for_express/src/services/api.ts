const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function sendChatMessage(prompt: string) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Unauthorized or session expired");
  }

  return res.json();
}
