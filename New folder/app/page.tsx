"use client"

import { useState, useEffect } from "react"
import { HomeScreen } from "@/components/home-screen"
import { ChatScreen } from "@/components/chat-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { SettingsScreen } from "@/components/settings-screen"
import { BottomNav } from "@/components/bottom-nav"
import { ToolsScreen } from "@/components/tools-screen"

export type Screen = "home" | "chat" | "profile" | "settings" | "tools"

export interface StudySession {
  id: string
  subjectId: string
  topic: string
  plannedTime: number // minutes
  actualTime: number // seconds
  status: "pending" | "in-progress" | "completed"
  startedAt?: string
  completedAt?: string
  timerRunning: boolean
}

export interface Subject {
  id: string
  name: string
  currentTopic: string
  plannedTime: number
  isCompleted: boolean
}

export interface ChatMemory {
  id: string
  subject: string
  topic: string
  date: string
  messages: { role: "user" | "assistant"; content: string }[]
}

export interface UserData {
  name: string
  class: number
  stream?: "Science" | "Commerce" | "Art"
  streak: number
  lastStreakDate: string | null
  coins: number
  subjects: Subject[]
  chatMemory: ChatMemory[]
  maxMemorySlots: number
  events: { id: string; date: string; title: string; type: "deadline" | "event" }[]
  productivityLog: { date: string; completedCount: number }[]
}

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [userData, setUserData] = useState<UserData>({
    name: "Student",
    class: 9,
    streak: 0,
    lastStreakDate: null,
    coins: 0,
    subjects: [],
    chatMemory: [],
    maxMemorySlots: 20,
    events: [],
    productivityLog: [],
  })

  useEffect(() => {
    const saved = localStorage.getItem("studyflow_os_v1")
    if (saved) {
      try {
        setUserData(JSON.parse(saved))
      } catch (e) {
        console.error("Data load failed", e)
      }
    }
  }, [])

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => {
      const next = { ...prev, ...data }
      localStorage.setItem("studyflow_os_v1", JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background text-foreground font-sans selection:bg-primary/20 overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20 scroll-smooth">
        {currentScreen === "home" && (
          <HomeScreen userData={userData} updateUserData={updateUserData} onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "chat" && <ChatScreen userData={userData} updateUserData={updateUserData} />}
        {currentScreen === "profile" && <ProfileScreen userData={userData} updateUserData={updateUserData} />}
        {currentScreen === "settings" && <SettingsScreen userData={userData} updateUserData={updateUserData} />}
        {currentScreen === "tools" && <ToolsScreen userData={userData} updateUserData={updateUserData} />}
      </main>

      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  )
}
