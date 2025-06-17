import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    // Get the auth object
    const { userId } = await auth() // Note the await here
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gameData = await request.json()

    // Validate required fields
    if (!gameData.title || !gameData.gameUrl) {
      return NextResponse.json(
        { error: 'Title and Game URL are required' },
        { status: 400 }
      )
    }

    // Insert game into PostgreSQL
    const result = await pool.query(
      `INSERT INTO games (
        title, 
        description, 
        game_url, 
        image_url, 
        category,
        author_id,
        author_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        gameData.title,
        gameData.description || '',
        gameData.gameUrl,
        gameData.imageUrl || '/images/default-game.png',
        gameData.category || 'arcade',
        userId,
        gameData.authorName || 'Anonymous'
      ]
    )

    return NextResponse.json({
      success: true,
      game: result.rows[0]
    })

  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    )
  }
}