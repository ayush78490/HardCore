"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUser, useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  url?: string;
  category?: string;
  published_at?: string;
  is_active?: boolean;
}

const defaultGames: Game[] = [
  {
    id: 1,
    title: "Catizen",
    description: "A brain storming puzzle game where you combine tiles to reach 2048.",
    image: "/images/catizen.png",
    url: "https://catizen-nine.vercel.app/",
    is_active: true,
  },
  {
    id: 2,
    title: "Knightfall",
    description: "A survival game where you play as a knight defending against waves of enemies.",
    image: "/images/default-game.png",
    url: "https://knight-fall-core.vercel.app/",
    is_active: true,
  },
  {
    id: 3,
    title: "Snow Boarder",
    description: "Snow Boarder is an exciting game where you navigate through snowy slopes.",
    image: "/images/snowman.png",
    url: "https://knight-fall-core.vercel.app/",
    is_active: true,
  },
  {
    id: 4,
    title: "Shooting Wizard",
    description: "A shooting game where you play as a wizard battling against various enemies.",
    image: "/images/spaceInvader.png",
    url: "https://danielzlatanov.github.io/softuni-wizard/",
    is_active: true,
  },
  {
    id: 5,
    title: "Space Invaders",
    description: "A classic arcade game where you defend against waves of alien invaders.",
    image: "/images/spaceGame.png",
    url: "https://space-invaders-by-tesfamichael-tafere.netlify.app/",
    is_active: true,
  },
];

const getImageSrc = (img: string | undefined): string => {
  if (!img) return '/images/default-game.png';
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return `/images/${img}`;
};

export function GamesGrid() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [userTimeBalance, setUserTimeBalance] = useState<number>(2.5);
  const [games, setGames] = useState<Game[]>(defaultGames);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStartingGame, setIsStartingGame] = useState<number | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (!isLoaded) return;

      try {
        let headers: HeadersInit = { "Content-Type": "application/json" };
        if (user) {
          const token = await getToken();
          if (token) {
            headers = { ...headers, Authorization: `Bearer ${token}` };
          }
        }

        const [balanceResponse, gamesResponse] = await Promise.all([
          user ? fetch("/api/user/balance", { 
            headers,
            signal: abortController.signal 
          }) : Promise.resolve(null),
          fetch("/api/games", { 
            headers,
            signal: abortController.signal 
          }),
        ]);

        if (user && balanceResponse) {
          if (!balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
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
              });
            } else if (balanceResponse.status === 404) {
              const createResponse = await fetch("/api/user/create", {
                method: "POST",
                headers,
                signal: abortController.signal
              });

              if (createResponse.ok) {
                const newBalanceResponse = await fetch("/api/user/balance", { 
                  headers,
                  signal: abortController.signal 
                });
                if (newBalanceResponse.ok) {
                  const newBalanceData = await newBalanceResponse.json();
                  setUserTimeBalance(newBalanceData.balance || 2.5);
                }
              }
            }
          } else {
            const balanceData = await balanceResponse.json();
            setUserTimeBalance(balanceData.balance || 2.5);
          }
        }

        if (!gamesResponse.ok) {
          setGames(defaultGames.filter(game => game.is_active !== false));
        } else {
          const gamesData: Game[] = await gamesResponse.json();
          const activeGames = gamesData.filter(game => game.is_active !== false);
          const mergedGames = [...activeGames];
          
          defaultGames.forEach(defaultGame => {
            if (!activeGames.some(g => g.id === defaultGame.id) && defaultGame.is_active !== false) {
              mergedGames.push(defaultGame);
            }
          });
          
          setGames(mergedGames);
        }
      } catch (error) {
        if (typeof error === "object" && error !== null && "name" in error && (error as { name?: string }).name !== 'AbortError') {
          console.error("Failed to fetch data:", error);
          toast({
            title: "Error",
            description: "Using default games due to connection issues",
            variant: "destructive",
          });
          setGames(defaultGames.filter(game => game.is_active !== false));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    return () => abortController.abort();
  }, [isLoaded, user, getToken]);

  const handlePlayGame = async (gameId: number) => {
    if (!isLoaded) return;

    setIsStartingGame(gameId);

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
      });
      setIsStartingGame(null);
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token available");

      const gameToPlay = games.find(game => game.id === gameId);
      if (!gameToPlay) throw new Error("Game not found");

      const response = await fetch("/api/games/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) throw new Error("Comming Soon.... This game is not available yet");
        if (data.code === "INSUFFICIENT_BALANCE") {
          toast({
            title: "Insufficient Time",
            description: `You need ${data.required}h but only have ${data.current}h. Please top up.`,
            variant: "destructive",
            action: (
              <Button variant="outline" size="sm" asChild>
                <Link href="/top-up">Top Up</Link>
              </Button>
            ),
          });
          return;
        }
        throw new Error(data.error || "Failed to start game session");
      }

      const { sessionId, remainingBalance } = data;
      setUserTimeBalance(remainingBalance);

      sessionStorage.setItem("gameSessionId", sessionId);
      sessionStorage.setItem("gameSessionStart", new Date().toISOString());

      // Navigate to the game page with the game ID
      router.push(`/games/${gameId}`);
    } catch (error) {
      console.error("Error starting game:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start game",
        variant: "destructive",
      });
    } finally {
      setIsStartingGame(null);
    }
  };

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
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">Games Library</h1>
          <p className="text-gray-400 text-sm">Discover and play hardcore games</p>
        </div>
        {user && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#2b2b2b] to-[#1a1a1a] px-5 py-3 rounded-xl w-full md:w-auto shadow-lg">
            <div className="text-right">
              <div className="text-gray-400 text-xs">Available Game Time</div>
              <div className="text-white font-semibold text-2xl">{userTimeBalance.toFixed(2)}h</div>
            </div>
            <Button asChild variant="secondary" size="sm" className="rounded-full">
              <Link href="/top-up" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>Top Up</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 mb-4">No games available yet</p>
          <Button asChild>
            <Link href="/publish">Be the first to publish a game</Link>
          </Button>
        </div>
      ) : (
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
                    src={getImageSrc(game.image)}
                    alt={`${game.title} cover image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default-game.png';
                    }}
                  />
                </div>
                <CardContent className="p-5 flex flex-col justify-between h-[220px]">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 truncate">{game.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{game.description}</p>
                    {game.category && (
                      <span className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">
                        {game.category}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full mt-2"
                    disabled={isStartingGame === game.id}
                    aria-label={`Play ${game.title}`}
                  >
                    {isStartingGame === game.id ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}