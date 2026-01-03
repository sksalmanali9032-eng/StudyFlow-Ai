import { askGemini } from "@/lib/gemini" // Assuming askGemini is imported from a library

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, systemPrompt: clientPrompt } = await req.json()

  const defaultPrompt = `You are a friendly AI Study Mentor for students in Class 5-10.`

  const systemPrompt = clientPrompt || defaultPrompt

  try {
    // Build the full conversation prompt for Gemini
    const conversationHistory = messages
      .map((msg: any) => {
        const content = msg.parts ? msg.parts.map((p: any) => p.text).join("") : msg.content
        return `${msg.role === "user" ? "Student" : "Mentor"}: ${content}`
      })
      .join("\n\n")

    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nMentor:`

    const aiMessage = await askGemini(fullPrompt)

    // Return in the format expected by the chat component
    return Response.json({
      text: aiMessage,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate response" },
      { status: 500 },
    )
  }
}
