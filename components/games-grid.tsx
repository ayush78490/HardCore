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
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@clerk/nextjs";



type Game = {
  id: number
  title: string
  description: string
  image: string
  url?: string
  category?: string
  published_at?: string
  is_active?: boolean
}

const defaultGames: Game[] = [
  {
    id: 1,
    title: "Catizen",
    description: "A brain storming puzzle game where you combine tiles to reach 2048.",
    image: "/images/catizen.png?height=200&width=300",
    is_active: true
  },
  {
    id: 2,
    title: "Knightfall",
    description: "A survival game where you play as a knight defending against waves of enemies.",
    image: "/images/default-game.png?height=200&width=300",
    is_active: true
  },
  {
    id: 3,
    title: "Snow Boarder",
    description: "Snow Boarder is an exciting game where you navigate through snowy slopes.",
    image: "/images/snowman.png?height=200&width=300",
    is_active: true
  },
  {
    id: 4,
    title: "shooting wizard",
    description: "A shooting game where you play as a wizard battling against various enemies.",
    image: "/images/spaceInvader.png?height=200&width=300",
    is_active: true
  },
  {
    id: 5,
    title: "Space Invaders",
    description: "A classic arcade game where you defend against waves of alien invaders.",
    image: "/images/spaceGame.png?height=200&width=300",
    is_active: true
  },
]

export function GamesGrid() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [userTimeBalance, setUserTimeBalance] = useState(2.5);
  const [publishedGames, setPublishedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingGame, setIsStartingGame] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (isLoaded && user) {
          const { getToken } = useAuth();
          const token = await getToken({ template: 'clerk' });
          if (token) {
            headers = {
              ...headers,
              Authorization: `Bearer ${token}`,
            };
          }
        }

        const [balanceResponse, gamesResponse] = await Promise.all([
          fetch('/api/user/balance', { headers }),
          fetch('/api/games'),
        ]);

        if (!balanceResponse.ok) {
          throw new Error('Failed to fetch balance');
        }
        if (!gamesResponse.ok) {
          throw new Error('Failed to fetch games');
        }

        const balanceData = await balanceResponse.json();
        const gamesData = await gamesResponse.json();

        setUserTimeBalance(balanceData.balance);
        setPublishedGames(gamesData.filter((game: Game) => game.is_active !== false));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load game data",
          variant: "destructive",
        });
        setPublishedGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user]);

  const handlePlayGame = async (gameId: number) => {
    if (!isLoaded) return
    
    setIsStartingGame(gameId)
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to play games",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        ),
      })
      setIsStartingGame(null)
      return
    }

    try {
      const response = await fetch('/api/games/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (data.code === 'INSUFFICIENT_BALANCE') {
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
        throw new Error(data.error || "Failed to start game session")
      }

      const { sessionId, remainingBalance } = data
      setUserTimeBalance(remainingBalance)
      
      // Store session info
      sessionStorage.setItem("gameSessionId", sessionId)
      sessionStorage.setItem("gameSessionStart", new Date().toISOString())
      
      router.push(`/games/${gameId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start game",
        variant: "destructive",
      })
    } finally {
      setIsStartingGame(null)
    }
  }

  // Combine and filter games
  const allGames = [...defaultGames, ...publishedGames].filter(game => game.is_active !== false)

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-16 w-full md:w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-video w-full rounded-t-2xl" />
              <div className="p-5 space-y-3 border border-t-0 rounded-b-2xl border-[#333]">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full mt-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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

      {allGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 mb-4">No games available yet</p>
          <Button asChild>
            <Link href="/publish">Be the first to publish a game</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGames.map((game, index) => (
            <motion.div
              key={`${game.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
            >
              <Card className="bg-[#1f1f1f] border border-[#333] hover:border-[#555] transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={
                      game.image
                        ? game.image.startsWith("/") 
                          ? game.image 
                          : `/images/${game.image}`
                        : "/images/default-game.png"
                    }
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
                    {game.category && (
                      <span className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full mb-3">
                        {game.category}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Button 
                      onClick={() => handlePlayGame(game.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full mt-2"
                      disabled={isStartingGame === game.id}
                    >
                      {isStartingGame === game.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          Play Game
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}