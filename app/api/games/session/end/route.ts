import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// app/api/games/session/end/route.ts
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { sessionId } = await request.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized: No user ID found' },
        { status: 401 }
      );
    }

    // Verify session exists and belongs to user
    const session = await prisma.gameSession.findFirst({
      where: { 
        id: sessionId,
        user: { clerkId: clerkId },
        endTime: null 
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or already ended' },
        { status: 404 }
      );
    }

    // Update session with end time
    await prisma.gameSession.update({
      where: { id: sessionId },
      data: { endTime: new Date() }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}