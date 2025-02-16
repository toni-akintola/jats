import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get('name');

  if (!name) {
    return new NextResponse('Name is required', { status: 400 });
  }

  const cookie = await cookies();
  
  cookie.set('hasVisited', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({
    result: name,
  },
  { status: 200 },);
}
