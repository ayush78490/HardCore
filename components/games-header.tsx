import { Gamepad2, Github, Twitter, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GamesHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Gamepad2 className="w-8 h-8 text-orange-500" />
          MONARCADE
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
        </div>
      </div>
    </header>
  )
}
