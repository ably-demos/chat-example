import { getSession } from '@/lib/session';
import * as Ably from 'ably'
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const session = await getSession(cookies());
  const ably = new Ably.Rest.Promise({ key: process.env.ABLY_API_KEY!});
  const token = await ably.auth.createTokenRequest({ clientId: session.username! },);
  return Response.json(token);
}
