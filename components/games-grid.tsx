"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Coins, Wallet } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

const games = [
  {
    id: 1,
    title: "joint 2048",
    description: "A brain storming puzzle game where you combine tiles to reach 2048.",
    image: "/images/2048.png?height=200&width=300",
    category: "Puzzle",
    difficulty: "Hard",
    cost: 0.5, // Hours required to play
    reward: 1.0 // Hours earned
  },
  {
    id: 2,
    title: "Shadow Strike",
    description: "Shadow Strike is a fast-paced action game that tests your reflexes.",
    image: "/images/commingSoon.jpg?height=200&width=300",
    category: "Action",
    difficulty: "Medium",
    cost: 0.75,
    reward: 1.25
  },
  {
    id: 3,
    title: "Core Tennis",
    description: "Tennis Gaming is committed to creating a realistic tennis experience.",
    image: "/images/commingSoon.jpg?height=200&width=300",
    category: "Sports",
    difficulty: "Easy",
    cost: 0.25,
    reward: 0.75
  },
  {
    id: 4,
    title: "Soul Defender",
    description: "Soul Defender is a fast-paced action game that challenges your skills.",
    image: "/images/commingSoon.jpg?height=200&width=300",
    category: "Action",
    difficulty: "Hard",
    cost: 1.0,
    reward: 2.0
  },
  {
    id: 5,
    title: "Hardcore Arena",
    description: "In Arena you have to battle against other players in intense combat.",
    image: "/images/commingSoon.jpg?height=200&width=300",
    category: "PvP",
    difficulty: "Expert",
    cost: 1.5,
    reward: 3.0
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400 bg-green-400/20"
    case "Medium":
      return "text-yellow-400 bg-yellow-400/20"
    case "Hard":
      return "text-orange-400 bg-red"
    case "Expert":
      return "text-red-400 bg-red-400/20"
    default:
      return "text-gray-400 bg-gray-400/20"
  }
}

export function GamesGrid() {
  const router = useRouter()
  const [userTimeBalance, setUserTimeBalance] = useState(2.5) // Initial demo balance

  const handlePlayGame = (gameId: number) => {
    const game = games.find(g => g.id === gameId)
    if (!game) return

    if (userTimeBalance < game.cost) {
      toast({
        title: "Not Enough Time",
        description: `You need ${game.cost} hours to play this game. Top up your balance.`,
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" asChild>
            <Link href="/top-up">Top Up</Link>
          </Button>
        )
      })
      return
    }

    // Deduct game cost and navigate
    setUserTimeBalance(prev => prev - game.cost)
    router.push(`/games/${gameId}`)
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Games Library</h1>
          <p className="text-gray-400">Discover and play hardcore games to earn rewards</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-800/50 px-4 py-3 rounded-lg w-full md:w-auto">
          <div className="text-right flex-1 md:flex-none">
            <div className="text-gray-400 text-sm">Available Game Time</div>
            <div className="text-white font-bold text-xl">
              {userTimeBalance.toFixed(2)} hours
            </div>
          </div>
          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link href="/top-up" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Top Up</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300 overflow-hidden h-full">
              <div className="aspect-video relative">
                <Image 
                  src={game.image} 
                  alt={game.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {game.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-white text-xs">{game.reward.toFixed(1)}h</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span>Cost to play</span>
                    </div>
                    <span className="text-white">{game.cost}h</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Potential earnings</span>
                    <span className="text-green-400">+{game.reward.toFixed(1)}h</span>
                  </div>

                  <Button 
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-3"
                  >
                    Play Game
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}