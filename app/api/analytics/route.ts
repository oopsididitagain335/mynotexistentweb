import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, update, get } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { username, linkId } = await req.json();
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  const clickData = {
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
  };

  try {
    const linkRef = ref(db, `analytics/${username}/links/${linkId}`);
    const userRef = ref(db, `analytics/${username}/users/${ip}`);
    
    await update(linkRef, { [uuidv4()]: clickData });
    await update(userRef, { lastSeen: clickData.timestamp });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
