"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Bot, Trash2, Clock } from "lucide-react"
import type { UserData, Subject } from "@/app/page"

interface ChatScreenProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

export function ChatScreen({ userData, updateUserData }: ChatScreenProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeSession, setActiveSession] = useState<Subject | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Find first subject with a topic that isn't completed
    const firstActive = userData.subjects.find((s) => s.currentTopic && !s.isCompleted)
    if (firstActive) setActiveSession(firstActive)
  }, [userData.subjects])

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false)
      if (activeSession) {
        completeSession(activeSession.id)
      }
    }
  }, [timerRunning, timeLeft])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [userData.chatMemory])

  const completeSession = (id: string) => {
    updateUserData({
      subjects: userData.subjects.map((s) => (s.id === id ? { ...s, isCompleted: true } : s)),
      coins: userData.coins + 20,
    })
    alert("Session time's up! Great discipline.")
  }

  const handleSend = async (forcedText?: string) => {
    const text = forcedText || input
    if (!text.trim() || isLoading) return

    if (userData.chatMemory.length >= userData.maxMemorySlots) {
      alert("Your study memory is full. Please delete older sessions to continue.")
      return
    }

    const today = new Date().toDateString()
    const newMsg = { role: "user" as const, content: text }

    // Update local state first
    const sessionKey = activeSession ? `${activeSession.name}-${activeSession.currentTopic}-${today}` : "general"
    const currentMem = userData.chatMemory.find((m) => m.id === sessionKey) || {
      id: sessionKey,
      subject: activeSession?.name || "General",
      topic: activeSession?.currentTopic || "Study",
      date: today,
      messages: [],
    }

    const updatedMem = { ...currentMem, messages: [...currentMem.messages, newMsg] }
    updateUserData({
      chatMemory: [...userData.chatMemory.filter((m) => m.id !== sessionKey), updatedMem],
    })
    setInput("")
    setIsLoading(true)

    if (text === "YES" && !timerRunning && activeSession) {
      setTimerRunning(true)
      setTimeLeft(activeSession.plannedTime * 60)
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMem.messages,
          systemPrompt: `You are a discipline-focused StudyFlow AI tutor. The student is studying ${activeSession?.name}: ${activeSession?.topic}. Keep responses concise and academically rigorous.`,
        }),
      })
      const data = await response.json()
      const aiMsg = { role: "assistant" as const, content: data.text || data.error || "AI failed to respond." }

      updateUserData({
        chatMemory: [
          ...userData.chatMemory.filter((m) => m.id !== sessionKey),
          {
            ...updatedMem,
            messages: [...updatedMem.messages, aiMsg],
          },
        ],
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const currentMessages = activeSession
    ? userData.chatMemory.find(
        (m) => m.id === `${activeSession.name}-${activeSession.currentTopic}-${new Date().toDateString()}`,
      )?.messages || []
    : []

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b flex justify-between items-center bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase italic italic">Tutor Console</h2>
            {timerRunning && (
              <p className="text-[10px] font-bold text-orange-500 flex items-center gap-1 uppercase tracking-widest">
                <Clock className="w-2.5 h-2.5" /> {formatTime(timeLeft)} Active
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => updateUserData({ chatMemory: [] })}
          className="text-muted-foreground"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSession && currentMessages.length === 0 && (
          <div className="space-y-4">
            <Card className="p-6 bg-primary text-primary-foreground border-none">
              <p className="font-bold text-sm leading-relaxed italic">
                “You planned to study {activeSession.name} – {activeSession.currentTopic} ({activeSession.plannedTime}{" "}
                mins). Should we start this study session?”
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => handleSend("YES")}
                  className="flex-1 font-black italic uppercase text-[10px]"
                >
                  Initialize Session
                </Button>
                <Button variant="ghost" className="flex-1 font-bold text-[10px]">
                  Delay Protocol
                </Button>
              </div>
            </Card>
          </div>
        )}

        {currentMessages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-[85%] p-4 text-xs font-medium leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground border-none" : "bg-muted border-none"}`}
            >
              {m.content}
            </Card>
          </div>
        ))}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />}
        <div ref={scrollRef} />
      </div>

      <footer className="p-4 bg-card border-t">
        <div className="flex gap-2">
          <Input
            placeholder={activeSession ? `Query subject matter...` : "Select subject on dashboard"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!activeSession || isLoading}
            className="h-11 bg-muted/50 border-none font-medium text-xs"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!activeSession || isLoading}
            size="icon"
            className="h-11 w-11 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
