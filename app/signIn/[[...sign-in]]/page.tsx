"use client"

import { GamesHeader } from "@/components/games-header"
import { Button } from "@/components/ui/button"
import { SignIn } from "@clerk/nextjs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
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
          
          <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-gray-400 mb-6">Sign in to play games and track your progress</p>
            
            <div className="flex justify-center">
              <SignIn 
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-none w-full",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "border-gray-700 hover:bg-gray-800 text-white",
                    socialButtonsBlockButtonText: "text-white",
                    dividerLine: "bg-gray-700",
                    dividerText: "text-gray-400",
                    formFieldLabel: "text-gray-400",
                    formFieldInput: "bg-[#2b2b2b] border-gray-700 text-white focus:border-orange-500",
                    formButtonPrimary: "bg-orange-600 hover:bg-orange-700",
                    footerActionText: "text-gray-400",
                    footerActionLink: "text-orange-500 hover:text-orange-400",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}