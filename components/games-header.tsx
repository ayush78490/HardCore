"use client"

import { Gamepad2, Github, Twitter, HelpCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function GamesHeader() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Gamepad2 className="w-8 h-8 text-orange-500" />
          HardCore Games
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-orange-500 hover:text-white">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-orange-500 hover:text-white">
            <Github className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-orange-500 hover:text-white">
            <Twitter className="w-5 h-5" />
          </Button>
          
          {isLoaded && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-orange-500 hover:text-white">
                  {isSignedIn ? (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      {user?.firstName?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#1f1f1f] border border-[#333]">
                {isSignedIn ? (
                  <>
                    <DropdownMenuItem 
                      className="text-white hover:bg-[#2b2b2b] cursor-pointer"
                      onClick={() => router.push("/profile")}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-white hover:bg-[#2b2b2b] cursor-pointer"
                      onClick={() => router.push("/sign-out")}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem 
                      className="text-white hover:bg-[#2b2b2b] cursor-pointer"
                      onClick={() => router.push("/sign-in")}
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-white hover:bg-[#2b2b2b] cursor-pointer"
                      onClick={() => router.push("/sign-up")}
                    >
                      Create Account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}