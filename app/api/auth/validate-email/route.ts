// app/api/validate-email/route.ts
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if email exists in the database
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true }
    });

    return NextResponse.json({ 
      isUnique: !existingUser,
      message: existingUser ? 'Email is already registered' : 'Email is available'
    });
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}