"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { UserData } from "@/app/page"

interface CheckInScreenProps {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

export function CheckInScreen({ userData, updateUserData }: CheckInScreenProps) {
  const [studyToday, setStudyToday] = useState<string>("")
  const [tough, setTough] = useState("")
  const [wentWell, setWentWell] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    if (!studyToday) return

    if (studyToday === "yes" || studyToday === "some") {
      updateUserData({
        streak: userData.streak + 1,
        coins: userData.coins + 5,
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setStudyToday("")
      setTough("")
      setWentWell("")
    }, 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-balance">Daily Check-In</h1>
        <p className="text-muted-foreground">{"Let's reflect on your study session"}</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Did you study today?</Label>
          <RadioGroup value={studyToday} onValueChange={setStudyToday}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="cursor-pointer">
                Yes, completed my plan! ✅
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="some" id="some" />
              <Label htmlFor="some" className="cursor-pointer">
                Some of it 📚
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="cursor-pointer">
                Not today ❌
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tough" className="text-base font-semibold">
            What was tough?
          </Label>
          <Textarea
            id="tough"
            value={tough}
            onChange={(e) => setTough(e.target.value)}
            placeholder="Any challenges or difficult topics?"
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wentWell" className="text-base font-semibold">
            What went well?
          </Label>
          <Textarea
            id="wentWell"
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            placeholder="Celebrate your wins!"
            className="min-h-24"
          />
        </div>

        <Button onClick={handleSubmit} disabled={!studyToday} className="w-full h-14 text-xl font-semibold" size="lg">
          Submit Check-In
        </Button>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {studyToday === "yes"
                ? "🎉 Great Job!"
                : studyToday === "some"
                  ? "👍 Good Effort!"
                  : "💪 Tomorrow is a new day!"}
            </DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              {studyToday !== "no" && (
                <>
                  <p className="text-lg font-semibold text-foreground">Streak +1 🔥</p>
                  <p className="text-lg">🪙 +5 coins earned</p>
                </>
              )}
              <p className="text-base">Keep up the amazing work!</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
