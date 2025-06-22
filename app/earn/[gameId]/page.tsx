"use client"

import { GamePlayer } from "@/components/game-player"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const defaultGames = {
  "1": { title: "CatiZen", url: "https://catizen-nine.vercel.app/" },
  "2": { title: "CatiZen", url: "https://knight-fall-core.vercel.app/" },
}

export default function GamePage() {
  const params = useParams()
  const gameId = params.gameId as string
  const [gameData, setGameData] = useState<{ title: string; url: string; image?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (Object.keys(defaultGames).includes(gameId)) {
          setGameData(defaultGames[gameId as keyof typeof defaultGames])
          setIsLoading(false)
          return
        }

        const apiTestUrl = '/api/games/test-connection'
        const testResponse = await fetch(apiTestUrl)
        if (!testResponse.ok) {
          throw new Error(`API test failed with status ${testResponse.status}`)
        }

        const apiUrl = `/api/games/${gameId}`
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Request": "true"
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed (${response.status}): ${response.statusText}`)
        }

        const data = await response.json()
        const gameUrl = data.game_url || data.url || data.gameUrl
        const gameTitle = data.title || "Published Game"
        const gameImage = data.image || data.imageUrl || "/images/default-game.png"

        if (!gameUrl || typeof gameUrl !== "string") {
          throw new Error("Game URL not found in response data")
        }

        setGameData({ title: gameTitle, url: gameUrl, image: gameImage })

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setError(errorMessage)
        setGameData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGameData()

    return () => {}
  }, [gameId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-sm text-gray-500">
          Loading game ID: {gameId}
        </div>
      </div>
    )
  }

  if (error || !gameData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-500 text-lg text-center mb-4">
          <p>Failed to load game (ID: {gameId}).</p>
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
    <GamePlayer gameId={gameId} title={gameData.title} url={gameData.url} image={gameData.image} />
  )
}
