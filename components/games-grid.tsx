"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Coins } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const games = [
	{
		id: 1,
		title: "joint 2048",
		description: "A brain storming puzzle game where you combine tiles to reach 2048.",
		image: "/images/2048.png?height=200&width=300",
		category: "Puzzle",
		difficulty: "Hard",
	},
	{
		id: 2,
		title: "Shadow Strike",
		description: "Shadow Strike is a fast-paced action game that tests your reflexes.",
		image: "/images/commingSoon.jpg?height=200&width=300",
		category: "Action",
		difficulty: "Medium",
	},
	{
		id: 3,
		title: "Core Tennis",
		description: "Tennis Gaming is committed to creating a realistic tennis experience.",
		image: "/images/commingSoon.jpg?height=200&width=300",
		category: "Sports",
		difficulty: "Easy",
	},
	{
		id: 4,
		title: "Soul Defender",
		description: "Soul Defender is a fast-paced action game that challenges your skills.",
		image: "/images/commingSoon.jpg?height=200&width=300",
		category: "Action",
		difficulty: "Hard",
	},
	{
		id: 5,
		title: "Hardcore Arena",
		description: "In Arena you have to battle against other players in intense combat.",
		image: "/images/commingSoon.jpg?height=200&width=300",
		category: "PvP",
		difficulty: "Expert",
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

	const handlePlayGame = (gameId: number) => {
		router.push(`/games/${gameId}`)
	}

	return (
		<div className="flex-1 p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Games Library</h1>
				<p className="text-gray-400">Discover and play hardcore games to earn rewards</p>
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
						onClick={() => handlePlayGame(game.id)}
					>
						<Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300 overflow-hidden">
							<div className="aspect-video relative">
								<Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
								<div className="absolute top-3 left-3 flex gap-2">
									<span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
										{game.category}
									</span>
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}
									>
										{game.difficulty}
									</span>
								</div>
								<div className="absolute top-3 right-3">
									<div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
										<Coins className="w-3 h-3 text-yellow-400" />
									</div>
								</div>
							</div>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-white mb-2">
									Game {game.id}: {game.title}
								</h3>
								<p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<Coins className="w-4 h-4 text-yellow-400" />
										<span className="text-gray-400 text-sm">to play</span>
									</div>
									<div className="text-gray-400 text-sm">
										Earn up to{" "}
									</div>
								</div>

								<Button className="w-full bg-green-600 hover:bg-green-700 text-white">
									Play Game
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	)
}
