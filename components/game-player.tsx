"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface GamePlayerProps {
  gameId: string
  title: string
  url: string
  image?: string 
}

export function GamePlayer({ gameId, title, url, image }: GamePlayerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const startTime = Date.now()
    sessionStorage.setItem("gameStartTime", startTime.toString())

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

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
  }, [gameId])

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

      {/* Game Arena */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 w-full">
            {image ? (
              <img
                src={image}
                alt="Game loading"
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            ) : (
              <Skeleton className="w-full h-full rounded-lg" />
            )}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : url ? (
          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-800">
            <iframe
              src={url}
              title={title}
              className="w-full h-full"
              style={{ border: "none" }}
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="eager"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-40 text-center p-6">
            <h2 className="text-3xl font-bold text-white mb-3">
              Game {gameId}: {title}
            </h2>
            <p className="text-red-400 text-lg font-medium">
              Game URL not configured
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              Back to Games
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
