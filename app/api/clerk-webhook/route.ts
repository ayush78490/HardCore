// app/api/clerk-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    if (payload.type === 'user.created') {
      const { id, email_addresses } = payload.data;
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          timeBalance: 0,
        },
      });
      console.log('Created user with clerkId:', id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}