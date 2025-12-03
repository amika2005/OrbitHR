import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokensFromCode } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the userId we passed
    
    if (!code || !state) {
      return NextResponse.redirect(new URL('/dashboard/leave?error=missing_params', request.url));
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/dashboard/leave?error=no_access_token', request.url));
    }

    // Find user by clerkId (state contains userId)
    const user = await db.user.findUnique({
      where: { clerkId: state },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/dashboard/leave?error=user_not_found', request.url));
    }

    // Store or update calendar integration
    await db.calendarIntegration.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || null,
        googleCalendarId: 'primary',
        syncEnabled: true,
      },
      update: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || null,
        syncEnabled: true,
      },
    });

    return NextResponse.redirect(new URL('/dashboard/leave?success=calendar_connected', request.url));
  } catch (error) {
    console.error('Google Calendar Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/leave?error=callback_failed', request.url));
  }
}
