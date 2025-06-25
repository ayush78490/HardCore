// app/api/games/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        gameUrl: true,
        category: true,
        publishedAt: true,
        likes: true,
        plays: true
      }
    });
    
    return NextResponse.json(games);
  } catch (error) {
    console.error('GET /api/games error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// Explicitly declare other HTTP methods as not allowed
export async function POST() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}