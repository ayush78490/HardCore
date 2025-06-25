// app/api/games/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to publish games' },
        { status: 401 }
      )
    }

    const gameData = await request.json()

    // Validate required fields
    if (!gameData.title?.trim()) {
      return NextResponse.json(
        { error: 'Game title is required' },
        { status: 400 }
      )
    }

    if (!gameData.gameUrl?.trim()) {
      return NextResponse.json(
        { error: 'Game URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(gameData.gameUrl.trim())
      if (gameData.imageUrl?.trim()) {
        new URL(gameData.imageUrl.trim())
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format provided' },
        { status: 400 }
      )
    }

    // Create game using Prisma
    const newGame = await prisma.game.create({
      data: {
        title: gameData.title.trim(),
        description: gameData.description?.trim() || '',
        gameUrl: gameData.gameUrl.trim(),
        imageUrl: gameData.imageUrl?.trim() || '/images/default-game.png',
        category: gameData.category?.trim() || 'arcade',
        authorId: userId,
        authorName: gameData.authorName?.trim() || 'Anonymous',
        // Prisma sets timestamps automatically if schema uses `@default(now())`
        // Else, you can set it here:
        // publishedAt: new Date()
      },
    })

    return NextResponse.json(
      { success: true, game: newGame },
      { status: 201 }
    )
  } catch (error) {
    console.error('Game Publish Error:', error)

    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'A game with this title or URL already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to publish game',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
