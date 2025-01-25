import { betterFetch } from '@better-fetch/fetch';
import { NextResponse, type NextRequest } from 'next/server';
import NodeCache from 'node-cache';
import { Session } from './app/(auth)/_lib/auth-types';

const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction ? 'https://foshati.com' : 'http://localhost:3000';

const routeChecks = {
  auth: ['/sign-in', '/reset-password', '/forget-password', '/sign-up'],
  admin: ['/admin', '/admin/*'],
  user: ['/dashboard', '/dashboard/*'],
};

const sessionCache = new NodeCache({ stdTTL: 5 * 60 });

async function getSession(request: NextRequest): Promise<Session | null> {
  const cookie = request.headers.get('cookie') || '';
  const cacheKey = cookie;

  const cachedSession = sessionCache.get<Session>(cacheKey);
  if (cachedSession) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cachedSession;
  }

  try {
    const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
      baseURL: baseUrl,
      headers: { cookie },
    });

    sessionCache.set(cacheKey, session);
    return session;
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return null;
  }
}

// Middleware
export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  try {
    const session = await getSession(request);

    // Redirect authenticated users away from auth routes
    if (routeChecks.auth.includes(pathName)) {
      if (session) {
        return NextResponse.redirect(new URL('/', baseUrl));
      }
      return NextResponse.next();
    }

    // Handle unauthenticated access for protected routes
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', baseUrl));
    }

    // Admin-specific route access
    if (routeChecks.admin.some((route) => pathName.startsWith(route))) {
      if (session.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', baseUrl));
      }
      return NextResponse.next();
    }

    // User-specific route access
    if (routeChecks.user.some((route) => pathName.startsWith(route))) {
      if (session.user.role !== 'user' && session.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', baseUrl));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    return NextResponse.redirect(new URL('/error', baseUrl));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/sign-in', '/reset-password', '/forget-password'],
};
