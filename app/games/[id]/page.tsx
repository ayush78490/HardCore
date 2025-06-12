"use client"

import { GamePlayer } from "@/components/game-player"
import { useParams } from "next/navigation"

const gameData = {
  "1": { title: "Hardcore Maze" },
  "2": { title: "Shadow Strike" },
  "3": { title: "Core Tennis" },
  "4": { title: "Soul Defender" },
  "5": { title: "Hardcore Arena" },
}

export default function GamePage() {
  const params = useParams()
  const gameId = params.id as string
  const game = gameData[gameId as keyof typeof gameData] || { title: "Unknown Game" }

  return <GamePlayer gameId={gameId} title={game.title} />
}
