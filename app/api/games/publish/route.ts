import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

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
      if (gameData.imageUrl) {
        new URL(gameData.imageUrl.trim())
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid URL format provided' },
        { status: 400 }
      )
    }

    // Insert game into database (without is_active)
    const result = await pool.query(
      `INSERT INTO games (
        title, 
        description, 
        game_url, 
        image_url, 
        category,
        author_id,
        author_name,
        published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [
        gameData.title.trim(),
        gameData.description?.trim() || '',
        gameData.gameUrl.trim(),
        gameData.imageUrl?.trim() || '/images/default-game.png',
        gameData.category?.trim() || 'arcade',
        userId,
        gameData.authorName?.trim() || 'Anonymous'
        // Removed is_active parameter
      ]
    )

    return NextResponse.json(
      { 
        success: true,
        game: result.rows[0] 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Game Publish Error:', error)
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'A game with this title or URL already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to publish game',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}