"use client"
import { Card } from "@/components/ui/card"
import { Flame, Coins, Target, Zap } from "lucide-react"
import type { UserData } from "@/app/page"

export function ProfileScreen({ userData }: { userData: UserData; updateUserData: any }) {
  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col items-center py-8 space-y-4">
        <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-primary/20 rotate-3 shadow-xl">
          <span className="text-4xl font-black italic text-primary">SF</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">{userData.name}</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Class {userData.class} Protocol Operator
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-orange-500/5 border-orange-500/20 flex flex-col items-center space-y-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <p className="text-2xl font-black italic">{userData.streak}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase">Streak Protocol</p>
        </Card>
        <Card className="p-4 bg-primary/5 border-primary/20 flex flex-col items-center space-y-2">
          <Coins className="w-6 h-6 text-primary" />
          <p className="text-2xl font-black italic">{userData.coins}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase">OS Credits</p>
        </Card>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Target className="w-4 h-4" /> System Analytics
        </h3>
        <Card className="p-6 space-y-6 border-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase italic">
              <span>Memory Buffers</span>
              <span>
                {userData.chatMemory.length}/{userData.maxMemorySlots} Slots
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${(userData.chatMemory.length / userData.maxMemorySlots) * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase italic">
              <span>Discipline Level</span>
              <span>{userData.coins > 100 ? "Elite" : "Junior"}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${Math.min((userData.coins / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="bg-muted/30 p-8 rounded-3xl border-2 border-dashed flex flex-col items-center text-center space-y-3">
        <Zap className="w-8 h-8 text-primary opacity-30" />
        <p className="text-xs font-medium italic text-muted-foreground leading-relaxed">
          "Discipline is the engine of the operating system. Without it, the flow stops."
        </p>
      </section>
    </div>
  )
}
