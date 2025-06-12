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

export function GamePlayer({ gameId, title }: GamePlayerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Simulate game loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate score increase
  useEffect(() => {
    if (!isLoading) {
      const scoreInterval = setInterval(() => {
        setScore((prev) => prev + Math.floor(Math.random() * 10))
      }, 3000)

      return () => clearInterval(scoreInterval)
    }
  }, [isLoading])

  if (gameId === "1") {
    return (
      <iframe
        src="https://the-joint-beta-rho.vercel.app/"
        title="The Joint Game"
        style={{ width: "100%", height: "80vh", border: "none" }}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-gray-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-lg">Score: {score}</div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-900/50 relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white">Loading {title}...</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Game {gameId}: {title}
              </h2>
              <p className="text-gray-400 mb-8">This is a placeholder for the actual game content.</p>
              <p className="text-green-500 text-xl">Earning rewards as you play!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
