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
import { useUser } from "@clerk/nextjs"

export function PublishGame() {
  const router = useRouter()
  const { user } = useUser()
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

      // Validate URL format
      if (!isValidUrl(formData.gameUrl)) {
        throw new Error("Please enter a valid game URL")
      }

      if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
        throw new Error("Please enter a valid image URL")
      }

      const response = await fetch('/api/games/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          gameUrl: formData.gameUrl,
          imageUrl: formData.imageUrl || "/images/default-game.png",
          category: formData.category,
          authorId: user?.id,
          authorName: user?.fullName || "Anonymous"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to publish game")
      }

      const result = await response.json()

      toast({
        title: "Game Published!",
        description: "Your game has been successfully published to the platform.",
        variant: "default",
      })

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        gameUrl: "",
        imageUrl: "",
        category: "arcade"
      })

      // Redirect to games page after a short delay
      setTimeout(() => {
        router.push("/games")
      }, 1500)

    } catch (error) {
      toast({
        title: "Publishing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to validate URLs
  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch (err) {
      return false
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-blue-400" />
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
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Tell players about your game (features, controls, etc.)"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="https://yourgame.com/play"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
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
  )
}