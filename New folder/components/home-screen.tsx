"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Check, Flame, Plus, Trash2, Settings2 } from "lucide-react"
import type { UserData, Subject, Screen } from "@/app/page"

interface HomeScreenProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  onNavigate: (screen: Screen) => void
}

export function HomeScreen({ userData, updateUserData, onNavigate }: HomeScreenProps) {
  const [newSubjectName, setNewSubjectName] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const today = new Date().toDateString()
    const lastDate = userData.lastStreakDate

    if (lastDate && lastDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastDate !== yesterday.toDateString()) {
        updateUserData({ streak: 0 })
      }
    }
  }, [])

  const addSubject = () => {
    if (!newSubjectName.trim()) return
    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      currentTopic: "",
      plannedTime: 30,
      isCompleted: false,
    }
    updateUserData({ subjects: [...userData.subjects, newSub] })
    setNewSubjectName("")
  }

  const deleteSubject = (id: string) => {
    updateUserData({ subjects: userData.subjects.filter((s) => s.id !== id) })
  }

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    updateUserData({
      subjects: userData.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }

  const startSession = (subject: Subject) => {
    if (!subject.currentTopic) {
      alert("Please enter a topic first")
      return
    }
    // Set as active session for AI and navigate
    onNavigate("chat")
  }

  const completeSubject = (subjectId: string) => {
    const today = new Date().toDateString()
    let newStreak = userData.streak
    let newLastDate = userData.lastStreakDate

    const subject = userData.subjects.find((s) => s.id === subjectId)
    if (!subject || subject.isCompleted) return

    // Streak Logic: Award once per day if at least one task is done
    if (newLastDate !== today) {
      newStreak += 1
      newLastDate = today
    }

    updateUserData({
      subjects: userData.subjects.map((s) => (s.id === subjectId ? { ...s, isCompleted: true } : s)),
      streak: newStreak,
      lastStreakDate: newLastDate,
      coins: userData.coins + 10,
    })
  }

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            StudyFlow<span className="text-primary">.AI</span>
          </h1>
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Student Productivity OS</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="font-black text-sm">{userData.streak}</span>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-black uppercase tracking-tight">Today's Protocol</h2>
          <p className="text-[10px] font-bold text-muted-foreground">
            {userData.subjects.filter((s) => s.isCompleted).length}/{userData.subjects.length} Tasks Clear
          </p>
        </div>

        <div className="grid gap-4">
          {userData.subjects.map((subject) => (
            <Card
              key={subject.id}
              className={`p-4 border-2 transition-all ${subject.isCompleted ? "opacity-50 border-dashed" : "border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3
                    className={`font-black text-base uppercase italic ${subject.isCompleted ? "line-through text-muted-foreground" : ""}`}
                  >
                    {subject.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSubject(subject.id)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {!subject.isCompleted ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Chapter / Topic"
                        value={subject.currentTopic}
                        onChange={(e) => updateSubject(subject.id, { currentTopic: e.target.value })}
                        className="h-9 text-xs font-medium bg-muted/30 border-none"
                      />
                      <Input
                        type="number"
                        placeholder="Mins"
                        value={subject.plannedTime}
                        onChange={(e) =>
                          updateSubject(subject.id, { plannedTime: Number.parseInt(e.target.value) || 0 })
                        }
                        className="w-16 h-9 text-xs font-bold bg-muted/30 border-none text-center"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startSession(subject)}
                        className="flex-1 h-9 font-black uppercase tracking-tighter italic text-[10px]"
                      >
                        <Play className="w-3 h-3 mr-1.5 fill-current" /> Start Session
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => completeSubject(subject.id)}
                        className="flex-1 h-9 font-black uppercase tracking-tighter italic text-[10px]"
                      >
                        <Check className="w-3 h-3 mr-1.5" /> Manual Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase italic">
                    <Check className="w-3 h-3" /> Discipline Maintained
                  </div>
                )}
              </div>
            </Card>
          ))}

          <Card className="p-4 border-2 border-dashed border-muted-foreground/30 bg-muted/10">
            <div className="flex gap-2">
              <Input
                placeholder="New Subject (e.g. Physics)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
                className="h-10 text-xs font-bold bg-transparent border-none focus-visible:ring-0 px-0"
              />
              <Button size="icon" onClick={addSubject} className="rounded-full h-10 w-10 shrink-0">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-primary p-6 rounded-2xl text-primary-foreground space-y-4">
        <h3 className="font-black italic uppercase tracking-tight flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Productivity Engine
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-60">Session Coins</p>
            <p className="text-2xl font-black italic">
              {userData.coins} <span className="text-xs opacity-60">₵</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-60">Active Power</p>
            <p className="text-2xl font-black italic">
              {userData.subjects.length > 0
                ? Math.round((userData.subjects.filter((s) => s.isCompleted).length / userData.subjects.length) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
