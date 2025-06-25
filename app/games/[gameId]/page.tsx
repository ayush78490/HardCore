"use client"

import { GamePlayer } from "@/components/game-player"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface GameData {
  title: string
  url: string
  image?: string
}

export default function GamePage() {
  const params = useParams()
  const gameId = params.gameId as string
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // First try to get from API
        const response = await fetch(`/api/games/${gameId}`)
        
        if (response.ok) {
          const data = await response.json()
          setGameData({
            title: data.title,
            url: data.gameUrl || data.url,
            image: data.imageUrl || data.image
          })
          return
        }

        // Fallback to default games if API fails
        const defaultGames = {
          "1": { title: "CatiZen", url: "https://catizen-nine.vercel.app/", image: "/images/catizen.png" },
          "2": { title: "Knightfall", url: "https://knight-fall-core.vercel.app/", image: "/images/default-game.png" },
          "3": { title: "Snow Boarder", url: "https://knight-fall-core.vercel.app/", image: "/images/snowman.png" },
          "4": { title: "Shooting Wizard", url: "https://danielzlatanov.github.io/softuni-wizard/", image: "/images/spaceInvader.png" },
          "5": { title: "Space Invaders", url: "https://space-invaders-by-tesfamichael-tafere.netlify.app/", image: "/images/spaceGame.png" },
        }

        if (gameId in defaultGames) {
          setGameData(defaultGames[gameId as keyof typeof defaultGames])
        } else {
          throw new Error("Game not found")
        }
      } catch (error) {
        console.error("Failed to fetch game data:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
        toast({
          title: "Error",
          description: "Failed to load game data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGameData()
  }, [gameId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-sm text-gray-500">
          Loading game...
        </div>
      </div>
    )
  }

  if (error || !gameData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-500 text-lg text-center mb-4">
          <p>Failed to load game.</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <GamePlayer 
      gameId={gameId} 
      title={gameData.title} 
      url={gameData.url} 
      image={gameData.image} 
    />
  )
}