"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, ArrowRight } from "lucide-react"

export function PublishGame() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gameUrl: "",
    imageUrl: "",
    category: "arcade"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title || !formData.gameUrl) {
        throw new Error("Title and Game URL are required")
      }

      const newGame = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        image: formData.imageUrl || "/images/default-game.png",
        url: formData.gameUrl,
        category: formData.category,
        publishedAt: new Date().toISOString()
      }

      const existingGames = JSON.parse(localStorage.getItem("userPublishedGames") || "[]")
      const updatedGames = [...existingGames, newGame]
      localStorage.setItem("userPublishedGames", JSON.stringify(updatedGames))

      toast({
        title: "Game Published!",
        description: "Your game has been successfully published.",
        variant: "default",
      })

      setTimeout(() => {
        router.push("/games")
      }, 1500)

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish game",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div>
        <div className="max-w-3xl mx-auto">
          <Card className="border border-gray-700 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-6 h-6" />
                Publish Your Game
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Share your game with the community and let others play it
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Game Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter your game title"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell players about your game"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[100px] focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gameUrl" className="text-gray-300">
                    Game URL *
                  </Label>
                  <Input
                    id="gameUrl"
                    name="gameUrl"
                    type="url"
                    value={formData.gameUrl}
                    onChange={handleChange}
                    placeholder="https://yourgame.com"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-gray-500 text-xs">
                    Must be a publicly accessible URL where your game is hosted
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-gray-300">
                    Cover Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/game-image.png"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-gray-500 text-xs">
                    Recommended size: 600x400px (will use default image if not provided)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="arcade">Arcade</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="action">Action</option>
                    <option value="adventure">Adventure</option>
                    <option value="strategy">Strategy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Publish Game
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>By publishing a game, you agree to our terms of service.</p>
            <p>Make sure you have the rights to share this content.</p>
          </div>
        </div>
      </div>
    </div>
  )
}