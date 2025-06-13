"use client"

import { Button } from "@/components/ui/button"
import { WalletConnect } from "./wallet-connect"
import { Gamepad2, TrendingUp, CreditCard, History, User, Upload } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { icon: Gamepad2, label: "Game Library", path: "/games" },
  { icon: TrendingUp, label: "Earn", path: "/earn" },
  { icon: CreditCard, label: "Top Up", path: "/top-up" },
  { icon: History, label: "History", path: "/history" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Upload, label: "Publish", path: "/publish" },
]

export function GamesSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900/50 border-r border-gray-800 p-6 flex flex-col">
      <div className="mb-8">
        <WalletConnect />
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                asChild
                variant={pathname.startsWith(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  pathname.startsWith(item.path) ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Link href={item.path} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <div className="mb-2">Balance</div>
          <div className="text-white font-mono">0 CORE</div>
        </div>
      </div>
    </div>
  )
}