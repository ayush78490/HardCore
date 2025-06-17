"use client"

import { GamesHeader } from "@/components/games-header"
import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignOutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <GamesHeader />
      <div className="container mx-auto px-4 pt-32 pb-16 flex flex-col items-center">
        <div className="w-full max-w-md">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to games
            </Link>
          </Button>
          <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-6 shadow-lg text-center">
            <h1 className="text-2xl font-bold text-white mb-6">Sign Out</h1>
            <div className="flex justify-center">
              <SignOutButton>
                <Button variant="destructive">Sign Out</Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}