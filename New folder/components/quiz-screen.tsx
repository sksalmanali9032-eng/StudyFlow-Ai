"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle } from "lucide-react"
import type { UserData } from "@/app/page"

interface QuizScreenProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export function QuizScreen({ userData, updateUserData }: QuizScreenProps) {
  const [subject, setSubject] = useState("Math")
  const [topic, setTopic] = useState("")
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [error, setError] = useState("")

  const getSubjects = () => {
    if (userData.class >= 9) {
      if (userData.stream === "Science") {
        return ["Physics", "Chemistry", "Biology", "Math"]
      } else if (userData.stream === "Commerce") {
        return ["Accounts", "Economics", "Business Studies", "Math"]
      } else if (userData.stream === "Art") {
        return ["History", "Geography", "Political Science", "Economics"]
      }
    }
    return ["Math", "Science", "English", "History", "Geography"]
  }

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for the quiz.")
      return
    }

    setError("")
    setIsGenerating(true)
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, topic, grade: userData.class }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate quiz")
      }

      const data = await response.json()
      setQuizQuestions(data.questions)
      setHasQuiz(true)
      setAnswers({})
      setShowResult(false)
    } catch (error) {
      console.error("Error generating quiz:", error)
      setError(error instanceof Error ? error.message : "Failed to generate quiz. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    let correct = 0
    quizQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correct++
      }
    })
    setScore(correct)
    setShowResult(true)
    const coinReward = correct === 5 ? 5 : correct >= 3 ? correct : 2
    updateUserData({
      coins: userData.coins + coinReward,
    })
  }

  const handleReset = () => {
    setAnswers({})
    setShowResult(false)
    setScore(0)
    setHasQuiz(false)
    setQuizQuestions([])
    setTopic("")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-balance">AI Quiz Generator</h1>
        <p className="text-muted-foreground">
          Class {userData.class}
          {userData.stream ? ` - ${userData.stream}` : ""} • 100% Free AI
        </p>
      </div>

      {!hasQuiz && (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Select Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getSubjects().map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Enter Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Newton's Laws, Photosynthesis, Fractions..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Enter the specific topic you want to practice</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={generateQuiz}
            disabled={isGenerating || !topic.trim()}
            className="w-full h-14 text-xl font-semibold"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </Card>
      )}

      {hasQuiz && quizQuestions.length > 0 && (
        <>
          <Card className="p-4 bg-primary/5">
            <p className="text-sm font-medium text-center">
              {subject} - {topic}
            </p>
          </Card>

          <div className="space-y-4">
            {quizQuestions.map((q, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {index + 1}. {q.question}
                  </h3>
                  <RadioGroup
                    value={answers[index]?.toString()}
                    onValueChange={(value) => setAnswers({ ...answers, [index]: Number.parseInt(value) })}
                    disabled={showResult}
                  >
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`q${index}-o${optionIndex}`} />
                        <Label htmlFor={`q${index}-o${optionIndex}`} className="cursor-pointer flex-1">
                          {String.fromCharCode(65 + optionIndex)}) {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </Card>
            ))}
          </div>

          {!showResult && (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quizQuestions.length}
              className="w-full h-14 text-xl font-semibold"
              size="lg"
            >
              Submit Quiz
            </Button>
          )}
        </>
      )}

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {score >= 4 ? "🎉 Excellent!" : score >= 3 ? "👍 Good Job!" : "💪 Keep Practicing!"}
            </DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-3xl font-bold text-foreground">
                {score}/{quizQuestions.length} Correct!
              </p>
              <p className="text-lg">🪙 +{score === 5 ? 5 : score >= 3 ? score : 2} coins earned</p>

              <div className="space-y-3 text-left pt-4">
                <h3 className="font-semibold text-foreground text-lg">Review:</h3>
                {quizQuestions.map((q, index) => {
                  const userAnswer = answers[index]
                  const isCorrect = userAnswer === q.correct
                  return (
                    <Card key={index} className={`p-4 ${isCorrect ? "border-green-500" : "border-red-500"}`}>
                      <p className="font-medium text-foreground mb-2">
                        {index + 1}. {q.question}
                      </p>
                      <p className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        Your answer: {q.options[userAnswer]}
                      </p>
                      {!isCorrect && <p className="text-sm text-green-600">Correct answer: {q.options[q.correct]}</p>}
                      <p className="text-sm text-muted-foreground mt-2">💡 {q.explanation}</p>
                    </Card>
                  )
                })}
              </div>

              <Button onClick={handleReset} className="w-full" size="lg">
                Generate New Quiz
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
