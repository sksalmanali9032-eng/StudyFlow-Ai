import { askGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  const { subject, topic, grade } = await req.json()

  if (!topic || !subject || !grade) {
    return Response.json({ error: "Subject, topic, and grade are required" }, { status: 400 })
  }

  const prompt = `Generate 5 multiple choice quiz questions for a Class ${grade} student about ${subject} - specifically on the topic: "${topic}". 

IMPORTANT: Return ONLY valid JSON in this exact format with no additional text:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation"
    }
  ]
}

Make the questions age-appropriate, educational, and engaging. Include a mix of difficulty levels. Each question must have exactly 4 options. The "correct" field should be 0, 1, 2, or 3 (index of correct answer).`

  try {
    const content = await askGemini(prompt)

    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse quiz data from AI response")
    }

    const quizData = JSON.parse(jsonMatch[0])

    // Validate the structure
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 5) {
      throw new Error("Invalid quiz structure")
    }

    return Response.json(quizData)
  } catch (error) {
    console.error("Quiz generation error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to generate quiz" }, { status: 500 })
  }
}
