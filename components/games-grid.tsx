"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

const games = [
  {
    id: 1,
    title: "joint 2048",
    description: "A brain storming puzzle game where you combine tiles to reach 2048.",
    image: "/images/2048.png?height=200&width=300",
  },
  {
    id: 2,
    title: "JavaScript console master",
    description: "A browser-based game that tests your JavaScript skills in a console environment.",
    image: "/images/javascriptConsole.png?height=200&width=300",
  },
  {
    id: 3,
    title: "Snow Boarder",
    description: "Snow Boarder is an exciting game where you navigate through snowy slopes.",
    image: "/images/snowman.png?height=200&width=300",
  },
  {
    id: 4,
    title: "shooting wizard",
    description: "A shooting game where you play as a wizard battling against various enemies.",
    image: "/images/spaceInvader.png?height=200&width=300",
  },
  {
    id: 5,
    title: "Space Invaders",
    description: "A classic arcade game where you defend against waves of alien invaders.",
    image: "/images/spaceGame.png?height=200&width=300",
  },
]

export function GamesGrid() {
  const router = useRouter()
  const [userTimeBalance, setUserTimeBalance] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("userTimeBalance")
    const parsed = stored ? parseFloat(stored) : NaN

    if (!isNaN(parsed)) {
      setUserTimeBalance(parsed)
    } else {
      localStorage.setItem("userTimeBalance", "2.5")
      setUserTimeBalance(2.5)
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userTimeBalance" && event.newValue) {
        const newParsed = parseFloat(event.newValue)
        if (!isNaN(newParsed)) {
          setUserTimeBalance(newParsed)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handlePlayGame = (gameId: number) => {
    if (userTimeBalance <= 0) {
      toast({
        title: "Insufficient Time",
        description: "You don't have enough time to play. Please top up.",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" asChild>
            <Link href="/top-up">Top Up</Link>
          </Button>
        ),
      })
      return
    }

    sessionStorage.setItem("gameStartTime", Date.now().toString())
    sessionStorage.setItem("lastUserTimeBalance", userTimeBalance.toString())
    router.push(`/games/${gameId}`)
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">Games Library</h1>
          <p className="text-gray-400 text-sm">Discover and play hardcore games</p>
        </div>

        <div className="flex items-center gap-4 bg-gradient-to-r from-[#2b2b2b] to-[#1a1a1a] px-5 py-3 rounded-xl w-full md:w-auto shadow-lg">
          <div className="text-right">
            <div className="text-gray-400 text-xs">Available Game Time</div>
            <div className="text-white font-semibold text-2xl">
              {userTimeBalance.toFixed(2)}h
            </div>
          </div>
          <Button asChild variant="secondary" size="sm" className="rounded-full">
            <Link href="/top-up" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Top Up</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
          >
            <Card className="bg-[#1f1f1f] border border-[#333] hover:border-[#555] transition-all duration-300 rounded-2xl overflow-hidden">
              <div className="aspect-video relative">
                <Image 
                  src={game.image} 
                  alt={game.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{game.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{game.description}</p>
                </div>

                <div className="mt-auto">
                  <Button 
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm rounded-full mt-2"
                  >
                    Play Game
                    <ArrowRight className="w-4 h-4 ml-1" />
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
