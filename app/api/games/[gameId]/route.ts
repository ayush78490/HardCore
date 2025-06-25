// app/api/games/[gameId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: Number(params.gameId) },
      select: {
        id: true,
        title: true,
        description: true,
        gameUrl: true,
        imageUrl: true,
        category: true,
        publishedAt: true,
        likes: true,
        plays: true
      }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('GET /api/games/[gameId] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}