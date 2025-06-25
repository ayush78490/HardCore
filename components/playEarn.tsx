"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, Coins, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useUser, useAuth } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"

type EarnGame = {
  id: number
  title: string
  description: string
  image: string
  rewardRate: number // CORE per hour
  difficulty: 'Easy' | 'Medium' | 'Hard'
  is_active?: boolean
}

const defaultEarnGames: EarnGame[] = [
  {
    id: 1,
    title: "CatiZen",
    description: "Manage your virtual crypto mining operation and earn rewards.",
    image: "/images/Catizen.png?height=200&width=300",
    rewardRate: 5,
    difficulty: 'Medium',
    is_active: true
  },
  {
    id: 2,
    title: "Blockchain Puzzle",
    description: "Solve blockchain-themed puzzles to earn CORE tokens.",
    image: "/images/2048.png?height=200&width=300",
    rewardRate: 3,
    difficulty: 'Easy',
    is_active: true
  },
]

export function EarnGrid() {
  const router = useRouter()
  const { isLoaded, user } = useUser()
  const { getToken } = useAuth()
  const [userBalance, setUserBalance] = useState(0) // CORE balance
  const [walletBalance, setWalletBalance] = useState(0) // Wallet CORE balance
  const [timeBalance, setTimeBalance] = useState(0) // Time balance in minutes
  const [publishedEarnGames, setPublishedEarnGames] = useState<EarnGame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStartingGame, setIsStartingGame] = useState<number | null>(null)
  const [isLoadingWalletBalance, setIsLoadingWalletBalance] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  // Fetch wallet balance from blockchain
  const fetchWalletBalance = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      return 0
    }

    try {
      setIsLoadingWalletBalance(true)
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length === 0) {
        setIsWalletConnected(false)
        return 0
      }

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      // Convert from wei to CORE
      const balanceInCore = parseInt(balance, 16) / Math.pow(10, 18)
      setIsWalletConnected(true)
      return balanceInCore
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error)
      return 0
    } finally {
      setIsLoadingWalletBalance(false)
    }
  }

  // Connect wallet and fetch balance
  const connectWallet = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        toast({
          title: "Wallet not found",
          description: "Please install a Web3 wallet like MetaMask",
          variant: "destructive",
        })
        return
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        const balance = await fetchWalletBalance()
        setWalletBalance(balance)
        setIsWalletConnected(true)
        toast({
          title: "Wallet connected",
          description: "Your wallet balance is now synced",
        })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  // Refresh all balances including time balance
  const refreshBalances = async () => {
    try {
      // Refresh wallet balance if connected
      if (isWalletConnected) {
        const balance = await fetchWalletBalance()
        setWalletBalance(balance)
      }

      // Refresh backend balances
      const [balanceResponse, timeResponse] = await Promise.all([
        fetch('/api/user/balance'),
        fetch('/api/user/time-balance')
      ])

      if (balanceResponse.ok) {
        const { coreBalance } = await balanceResponse.json()
        setUserBalance(coreBalance)
      }

      if (timeResponse.ok) {
        const { timeBalance: timeBalanceInMinutes } = await timeResponse.json()
        setTimeBalance(timeBalanceInMinutes)
      }
    } catch (error) {
      console.error("Failed to refresh balances:", error)
    }
  }

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      if (!isLoaded) return

      try {
        let headers: HeadersInit = { "Content-Type": "application/json" }
        if (user) {
          const token = await getToken()
          if (token) {
            headers = { ...headers, Authorization: `Bearer ${token}` }
          }
        }

        const [balanceResponse, gamesResponse, timeResponse] = await Promise.all([
          user
            ? fetch("/api/user/balance", { headers, signal: abortController.signal })
            : Promise.resolve(null),
          fetch("/api/games?type=earn", { headers, signal: abortController.signal }),
          fetch("/api/user/time-balance", { headers, signal: abortController.signal }),
        ])

        // Handle balance
        if (user && balanceResponse) {
          if (!balanceResponse.ok) {
            if (balanceResponse.status === 401) {
              toast({
                title: "Unauthorized",
                description: "Please sign in to view your balance.",
                variant: "destructive",
                action: (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                ),
              })
            } else if (balanceResponse.status === 404) {
              // Try to create user and refetch balance
              const createResponse = await fetch("/api/user/create", {
                method: "POST",
                headers,
                signal: abortController.signal,
              })
              if (createResponse.ok) {
                const newBalanceResponse = await fetch("/api/user/balance", {
                  headers,
                  signal: abortController.signal,
                })
                if (newBalanceResponse.ok) {
                  const newBalanceData = await newBalanceResponse.json()
                  setUserBalance(newBalanceData.balance || 2.5)
                }
              }
            }
          } else {
            const balanceData = await balanceResponse.json()
            setUserBalance(balanceData.balance || 2.5)
          }
        }

        // Handle games
        if (gamesResponse.ok) {
          const games: EarnGame[] = await gamesResponse.json()
          setPublishedEarnGames(games.filter(game => game.is_active !== false))
        } else {
          setPublishedEarnGames([])
        }

        // Handle time balance
        if (timeResponse.ok) {
          const { timeBalance: timeBalanceInMinutes } = await timeResponse.json()
          setTimeBalance(timeBalanceInMinutes)
        }

        // Wallet connection (unchanged)
        if (typeof window !== "undefined" && window.ethereum) {
          const balance = await fetchWalletBalance()
          setWalletBalance(balance)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load earn games data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Set up event listeners for wallet changes
    if (typeof window !== "undefined" && window.ethereum && typeof window.ethereum.on === "function") {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          const balance = await fetchWalletBalance()
          setWalletBalance(balance)
        } else {
          setIsWalletConnected(false)
          setWalletBalance(0)
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      abortController.abort()
      if (
        typeof window !== "undefined" &&
        window.ethereum &&
        typeof window.ethereum.removeAllListeners === "function"
      ) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [isLoaded, user, getToken])

  const handlePlayGame = async (gameId: number) => {
    if (!isLoaded) return
    
    setIsStartingGame(gameId)
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to play earn games",
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

    // Check time balance before starting the game
    if (timeBalance <= 0) {
      toast({
        title: "No time balance",
        description: "You don't have enough time balance to play this game",
        variant: "destructive",
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
        body: JSON.stringify({
          gameId,
          userId: user.id
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to start earn game")
      }

      const { sessionId } = await response.json()
      sessionStorage.setItem("earnGameSessionId", sessionId)
      router.push(`/earn/${gameId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start earn game",
        variant: "destructive",
      })
    } finally {
      setIsStartingGame(null)
    }
  }

  const allEarnGames = [...defaultEarnGames, ...publishedEarnGames].filter(game => game.is_active !== false)

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
          <h1 className="text-4xl font-extrabold text-white mb-1">Earn Games</h1>
          <p className="text-gray-400 text-sm">Play games and earn CORE tokens</p>
        </div>

        <div className="flex items-center gap-4 bg-gradient-to-r from-[#2b2b2b] to-[#1a1a1a] px-5 py-3 rounded-xl w-full md:w-auto shadow-lg">
          <div className="text-right">
            <div className="text-gray-400 text-xs">Available Tme Balance </div>
            <div className="text-white font-semibold text-2xl flex items-center gap-2">
              {isLoadingWalletBalance ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {(userBalance + walletBalance).toFixed(2)} Min.
                  <button 
                    onClick={refreshBalances}
                    className="text-gray-400 hover:text-white transition-colors"
                    disabled={isLoadingWalletBalance}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingWalletBalance ? 'animate-spin' : ''}`} />
                  </button>
                </>
              )}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Time Balance: {Math.floor(userBalance / 60)}h {userBalance % 60}m
            </div>
          </div>
          {/* {isWalletConnected ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-300">Connected</span>
            </div>
          ) : (
            <Button 
              onClick={connectWallet}
              variant="secondary" 
              size="sm" 
              className="rounded-full flex items-center gap-2"
              disabled={isLoadingWalletBalance}
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </Button>
          )} */}
        </div>
      </div>

      {allEarnGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 mb-4">No earn games available yet</p>
          <Button asChild>
            <Link href="/publish">Publish your earn game</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allEarnGames.map((game, index) => (
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
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full">
                        <Coins className="w-3 h-3" />
                        <span>{game.rewardRate} CORE/h</span>
                      </div>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                        game.difficulty === 'Easy' ? 'bg-blue-900/50 text-blue-300' :
                        game.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {game.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      onClick={() => handlePlayGame(game.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full mt-2"
                      disabled={isStartingGame === game.id || timeBalance <= 0}
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
                    {timeBalance <= 0 && (
                      <p className="text-red-400 text-xs mt-2 text-center">
                        You don't have enough time balance to play
                      </p>
                    )}
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