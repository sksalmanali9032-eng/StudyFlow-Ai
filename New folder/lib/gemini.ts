const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function askGemini(prompt: string): Promise<string> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  )

  const data = await res.json()

  if (!res.ok) {
    console.error("GEMINI ERROR:", data)
    throw new Error(data.error?.message || "Gemini API failed")
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response."
}
