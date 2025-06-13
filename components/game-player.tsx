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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-[#bbada0]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        <h1 className="text-xl font-bold text-[#bbada0]">{title}</h1>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-900/50 relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#bbada0]">Loading {title}...</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {gameId === "1" ? (
              <iframe
                src="https://the-joint-beta-rho.vercel.app/"
                title="The Joint Game"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Game {gameId}: {title}
                </h2>
                <p className="text-green-500 text-xl">Earning rewards as you play!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
