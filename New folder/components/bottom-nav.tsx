"use client"

import { Home, MessageSquare, Wrench, User } from "lucide-react"
import type { Screen } from "@/app/page"

interface BottomNavProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems: { icon: any; label: string; screen: Screen }[] = [
    { icon: Home, label: "Dashboard", screen: "home" },
    { icon: MessageSquare, label: "Tutor", screen: "chat" },
    { icon: Wrench, label: "Tools", screen: "tools" },
    { icon: User, label: "Profile", screen: "profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border shadow-[0_-4px_10px_rgba(0,0,0,0.02)] max-w-md mx-auto z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map(({ icon: Icon, label, screen }) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all ${
              currentScreen === screen
                ? "text-primary border-t-2 border-primary -mt-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${currentScreen === screen ? "fill-primary/10" : ""}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
