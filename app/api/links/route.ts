import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  try {
    const snapshot = await get(ref(db, `users/${username}/links`));
    const data = snapshot.exists() ? snapshot.val() : [];
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load links' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, links } = body;

  if (!username || !links) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    await set(ref(db, `users/${username}/links`), links);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
