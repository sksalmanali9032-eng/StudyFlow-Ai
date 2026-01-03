"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Timer, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react"
import type { UserData } from "@/app/page"

export function ToolsScreen({ userData, updateUserData }: { userData: UserData; updateUserData: (d: any) => void }) {
  const [swTime, setSwTime] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())

  useEffect(() => {
    let interval: any
    if (swRunning) {
      interval = setInterval(() => setSwTime((t) => t + 10), 10)
    }
    return () => clearInterval(interval)
  }, [swRunning])

  const formatSw = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${m.toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}.${Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0")}`
  }

  const renderCalendar = () => {
    const days = new Date(calYear, calMonth + 1, 0).getDate()
    const first = new Date(calYear, calMonth, 1).getDay()
    const blanks = Array(first).fill(null)
    const items = Array.from({ length: days }, (_, i) => i + 1)

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-black italic uppercase tracking-tighter">
            {new Date(calYear, calMonth).toLocaleString("default", { month: "long" })} {calYear}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCalMonth((m) => (m === 0 ? 11 : m - 1))}
              className="h-7 w-7"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCalMonth((m) => (m === 11 ? 0 : m + 1))}
              className="h-7 w-7"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-muted-foreground uppercase">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d}>{d}</div>
          ))}
          {blanks.map((_, i) => (
            <div key={`b-${i}`} className="p-2" />
          ))}
          {items.map((d) => (
            <div
              key={d}
              className={`p-2 text-[10px] font-black rounded-md ${d === new Date().getDate() && calMonth === new Date().getMonth() ? "bg-primary text-primary-foreground" : "bg-muted/30"}`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-black uppercase italic tracking-tighter">Tools Hub</h2>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Timer className="w-3 h-3" /> Master Stopwatch
        </h3>
        <Card className="p-8 flex flex-col items-center justify-center space-y-6 border-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="text-4xl font-mono font-black tracking-tighter">{formatSw(swTime)}</div>
          <div className="flex gap-2 w-full">
            <Button onClick={() => setSwRunning(!swRunning)} className="flex-1 font-black uppercase italic">
              {swRunning ? "Pause" : "Start"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSwTime(0)
                setSwRunning(false)
              }}
              className="flex-1 font-black uppercase italic"
            >
              Reset
            </Button>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Calendar className="w-3 h-3" /> Academic Calendar
        </h3>
        <Card className="p-6 border-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">{renderCalendar()}</Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <ClipboardList className="w-3 h-3" /> Productivity Log
        </h3>
        <Card className="p-4 space-y-2 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
          {userData.subjects.filter((s) => s.isCompleted).length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic text-center py-4 uppercase">
              No protocols executed today
            </p>
          ) : (
            userData.subjects
              .filter((s) => s.isCompleted)
              .map((s) => (
                <div key={s.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-[10px] font-black uppercase italic">{s.name}</span>
                  <span className="text-[8px] font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Protocol Clear
                  </span>
                </div>
              ))
          )}
        </Card>
      </section>
    </div>
  )
}
