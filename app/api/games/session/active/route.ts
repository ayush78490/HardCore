// app/api/games/session/active/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const activeSession = await prisma.gameSession.findFirst({
      where: {
        user: { clerkId },
        endTime: null
      },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    return NextResponse.json({ activeSession });
  } catch (error) {
    console.error('Error checking active session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}