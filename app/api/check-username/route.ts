// src/app/api/check-username/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ 
      isAvailable: false, 
      message: 'Username is required' 
    }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { 
        username: username.toLowerCase().trim() 
      }
    });

    return NextResponse.json({ 
      isAvailable: !existingUser, 
      message: existingUser ? 'Username is already taken' : 'Username is available'
    });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json({ 
      isAvailable: false, 
      message: 'An error occurred while checking username' 
    }, { status: 500 });
  }
}