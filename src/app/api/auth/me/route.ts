import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '../../../../lib/currentUser';

export async function GET(request: Request) {
  const u = await getCurrentUserFromRequest(request);
  return NextResponse.json(u || null);
}
