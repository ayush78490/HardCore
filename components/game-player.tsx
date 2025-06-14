"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import React from "react"

interface GamePlayerProps {
  gameId: string
  title: string
}

const gameUrls: Record<string, string> = {
  "1": "https://the-joint-beta-rho.vercel.app/",
  "2": "https://untrustedgame.com/", // javascript browser game
  "3": "https://mrbid.github.io/snowboarder/", // Snowboarder
  "4": "https://danielzlatanov.github.io/softuni-wizard/", // shooting wizard game
  "5": "https://space-invaders-by-tesfamichael-tafere.netlify.app/", // space invaders
  "6": "https://45d94cd0-12d0-4056-93a0-f0cc96ce818b.poki-gdn.com/29a6ef65-4b2d-4e0a-8e06-277b83ce3448/index.html", // Recoil
  "7": "https://games.poki.com/458768/13acae8c-ec6a-4823-b1a2-8ea20cea56e7", // Level Devil
  "8": "https://0b198e1a-c8f9-4f41-8936-5d5b33331185.poki-gdn.com/2676dd29-a01e-4918-8191-f294e7af613e/index.html", // Tiny Towers
  "9": "https://b67336d6-f18a-436d-9569-9c6b6bb75643.poki-gdn.com/e2b29336-109c-4c5d-8b37-efed554952e6/index.html", // Space Thing
  "10": "https://65da0c2b-cb4a-439a-8d64-bff4f5d9b623.poki-gdn.com/a51c2a3f-5ad7-4df5-a649-00361ffa5736/index.html", // Ninja vs Evilcorp
  "11": "https://games.poki.com/458768/5d0a1c3d-25cc-4704-955a-9d6e3270e75c", // Museum of Dots
  "12": "https://62afe744-3888-4a02-a116-17fc32c4dada.poki-gdn.com/437c5a2d-d994-4620-913e-19d0621d3e48/index.html", // Hefty Shaman Deluxe
}

export function GamePlayer({ gameId, title }: GamePlayerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)

    const startTime = Date.now()
    sessionStorage.setItem("gameStartTime", startTime.toString())

    return () => {
      clearTimeout(timer)

      const endTime = Date.now()
      const storedStart = sessionStorage.getItem("gameStartTime")

      if (storedStart) {
        const elapsedMs = endTime - parseInt(storedStart, 10)
        const elapsedHours = elapsedMs / (1000 * 60 * 60)

        const storedBalance = localStorage.getItem("userTimeBalance")
        const oldBalance = storedBalance ? parseFloat(storedBalance) : 0
        const newBalance = Math.max(0, oldBalance - elapsedHours)

        localStorage.setItem("userTimeBalance", newBalance.toFixed(4))
      }

      sessionStorage.removeItem("gameStartTime")
    }
  }, [])

  const gameUrl = gameUrls[gameId]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-950 shadow-md">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-[#bbada0] hover:text-orange-500 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h1 className="text-xl font-semibold text-[#bbada0]">{title}</h1>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#bbada0] text-sm">Loading {title}...</p>
          </div>
        ) : (
          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-800">
            {gameUrl ? (
              <iframe
                src={gameUrl}
                title={title}
                className="w-full h-full"
                style={{ border: "none" }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-40 text-center p-6">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Game {gameId}: {title}
                </h2>
                <p className="text-red-400 text-lg font-medium">
                  Game not found or URL not configured.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
