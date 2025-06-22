import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request); // Now using getAuth with the request object
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { gameId } = await request.json();

    // Validate inputs
    if (!gameId) {
      return NextResponse.json(
        { error: 'Missing gameId' },
        { status: 400 }
      );
    }

    // Get the game
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Get user's current balance
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, timeBalance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if game is active
    if (game.is_active === false) {
      return NextResponse.json(
        { error: 'This game is currently unavailable' },
        { status: 400 }
      );
    }

    // Calculate time deduction (0.5 hours per session)
    const timeDeduction = 0.5;

    // Check sufficient balance
    if (user.timeBalance < timeDeduction) {
      return NextResponse.json(
        { 
          error: 'Insufficient time balance',
          code: 'INSUFFICIENT_BALANCE'
        },
        { status: 400 }
      );
    }

    // Create transaction for session and balance update
    const [session, updatedUser] = await prisma.$transaction([
      prisma.gameSession.create({
        data: {
          gameId,
          userId: user.id,
          startTime: new Date(),
          timeDeduction,
        },
      }),
      prisma.user.update({
        where: { clerkId: userId },
        data: {
          timeBalance: {
            decrement: timeDeduction,
          },
        },
        select: {
          timeBalance: true,
        },
      }),
    ]);

    // Return success response
    return NextResponse.json({
      sessionId: session.id,
      remainingBalance: updatedUser.timeBalance,
    });

  } catch (error) {
    console.error('Error starting game session:', error);
    return NextResponse.json(
      { error: 'Failed to start game session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}