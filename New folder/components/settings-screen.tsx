"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Zap } from "lucide-react"
import type { UserData } from "@/app/page"

interface SettingsScreenProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

export function SettingsScreen({ userData, updateUserData }: SettingsScreenProps) {
  const [apiKey, setApiKey] = useState(userData.apiKey || "")
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSaveApiKey = () => {
    updateUserData({ apiKey })
  }

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      localStorage.removeItem("studyflow_user")
      window.location.reload()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your app settings</p>
      </div>

      {/* API Key Section */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">100% Free AI Powered</h2>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            StudyFlow.AI uses Puter.js - a completely free AI service with no signup or API key required!
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Unlimited AI Chat conversations</li>
            <li>Unlimited Quiz generation</li>
            <li>No costs, no limits, no signup</li>
            <li>Perfect for students everywhere!</li>
          </ul>
        </div>
      </Card>

      {/* Theme Section */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Current Theme</h2>
        <div className="p-4 bg-secondary/10 rounded-lg text-center">
          <p className="font-medium capitalize">{(userData.currentTheme || "default").replace("-", " ")}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Visit the Profile screen to purchase and change themes with coins.
        </p>
      </Card>

      {/* Data Management */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-semibold">Data Management</h2>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Reset all app data including progress, coins, and settings.</p>
          <Button onClick={handleResetData} variant="destructive" className="w-full">
            Reset All Data
          </Button>
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-6 space-y-2">
        <h2 className="text-lg font-semibold">About</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>StudyFlow.AI Pro</p>
          <p>Version 2.0 - Free Edition</p>
          <p>Built for Class 9-10 Students</p>
          <p>Powered by Puter.js</p>
        </div>
      </Card>
    </div>
  )
}
