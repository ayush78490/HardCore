"use client"

import { GamesHeader } from "@/components/games-header"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <GamesHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-16 flex flex-col items-center">
        <div className="w-full max-w-md">
          <Button asChild variant="ghost" className="mb-6 bg-orange-500 text-white hover:bg-orange-600">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to games
            </Link>
          </Button>
          
          <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {user?.firstName?.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold text-white">
                {user?.fullName}
              </h1>
              <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/top-up" className="bg-orange-500 text-white hover:bg-orange-600">
                  Top Up Game Time
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-out" className="bg-red-500 text-white hover:bg-red-600">
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}