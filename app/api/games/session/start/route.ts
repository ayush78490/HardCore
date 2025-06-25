import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Required for Clerk auth

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId } = await request.json();

    // Check if game exists and is active
    const game = await prisma.game.findUnique({
      where: { id: gameId, isActive: true },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found or inactive' }, { status: 404 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, timeBalance: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId, timeBalance: 2.5 },
        select: { id: true, timeBalance: true },
      });
    }

    // Check balance (0.5 hours per session)
    const SESSION_COST = 0.5;
    if (user.timeBalance < SESSION_COST) {
      return NextResponse.json(
        {
          error: 'Insufficient balance',
          code: 'INSUFFICIENT_BALANCE',
          required: SESSION_COST,
          current: user.timeBalance,
        },
        { status: 402 }
      );
    }

    // Start transaction
    const [session, updatedUser] = await prisma.$transaction([
      prisma.gameSession.create({
        data: { userId: user.id, gameId: game.id, cost: SESSION_COST },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { timeBalance: { decrement: SESSION_COST } },
        select: { timeBalance: true },
      }),
    ]);

    return NextResponse.json({
      sessionId: session.id,
      remainingBalance: updatedUser.timeBalance,
    });
  } catch (error) {
    console.error('Error starting game session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}