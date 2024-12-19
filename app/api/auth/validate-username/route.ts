import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Check if username exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true }
    });

    return NextResponse.json({ 
      isUnique: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    });
  } catch (error) {
    console.error('Username validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
