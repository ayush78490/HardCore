// app/api/user/create/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        timeBalance: 2.5,
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}