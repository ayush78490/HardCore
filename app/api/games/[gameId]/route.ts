import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: { gameId: string } }
) {
  try {
    const { params } = context; 
    const gameId = params?.gameId;

    if (!/^\d+$/.test(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID format' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT 
        id,
        title,
        game_url as "gameUrl",
        description,
        image_url as "imageUrl",
        category,
        published_at as "publishedAt",
        likes,
        plays,
        author_name as "authorName"
      FROM games 
      WHERE id = $1`,
      [gameId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    const game = result.rows[0];
    return NextResponse.json({
      title: game.title,
      game_url: game.gameUrl,
      image: game.imageUrl
    });

  } catch (error) {
    console.error('Game Fetch Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch game',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
