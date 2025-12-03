import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl(userId: string) {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: userId, // Pass userId to identify the user after OAuth
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function setCredentials(accessToken: string, refreshToken?: string) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
}

export async function createCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  }
) {
  const auth = setCredentials(accessToken, refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data;
}

export async function deleteCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string
) {
  const auth = setCredentials(accessToken, refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });
}

export async function listCalendarEvents(
  accessToken: string,
  refreshToken: string | undefined,
  timeMin: string,
  timeMax: string
) {
  const auth = setCredentials(accessToken, refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}
