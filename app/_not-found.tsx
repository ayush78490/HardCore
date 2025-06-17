'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-4xl font-bold text-center">404 - Game Over</h1>
      <p className="text-xl text-gray-400 text-center">
        The level you're looking for doesn't exist in our universe
      </p>
      <Button 
        onClick={() => router.push('/')}
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        Return to Home Base
      </Button>
    </div>
  )
}