// app/top-up/page.tsx
import { TopUpForm } from "@/components/top-up-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TopUpPage() {
  return (
    <div
      className="w-[100vw] mx-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.9)",height: "100vh" }}
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Buy Game Time</CardTitle>
        </CardHeader>
        <CardContent>
          <TopUpForm />
        </CardContent>
      </Card>
    </div>
  )
}