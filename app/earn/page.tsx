import { GamesHeader } from "@/components/games-header"
import { GamesSidebar } from "@/components/games-sidebar"
// import { GamesGrid } from "@/components/games-grid"/
import { EarnGrid} from "@/components/playEarn"

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-black">
      <GamesHeader />
      <div className="pt-16 flex">
        <GamesSidebar />
        <EarnGrid />
      </div>
    </div>
  )
}
