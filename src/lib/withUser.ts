import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from './currentUser';

type ApiHandler = (request: Request, user: any | null) => Promise<Response | typeof NextResponse> | Response | typeof NextResponse;

export function withUser(handler: ApiHandler) {
  return async function(request: Request) {
    const user = await getCurrentUserFromRequest(request);
    return await handler(request, user);
  };
}

export function requireAdmin(handler: ApiHandler) {
  return async function(request: Request) {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return await handler(request, user);
  };
}
