// lib/ban-sync.ts
import { db } from './firebase';
import { sendEmail } from './email';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Sync a ban from Discord to the website.
 */
export const syncBanToWeb = async (discordId: string): Promise<void> => {
  const linkedRef = doc(db, 'linkedUsers', discordId);
  const linkedSnap = await getDoc(linkedRef);

  if (!linkedSnap.exists()) return;

  const userData = linkedSnap.data();
  const userRef = doc(db, 'users', userData.uid);

  await updateDoc(userRef, {
    banned: true,
    bannedAt: new Date(),
    bannedBy: 'discord',
    previousPrivacy: userData.privacy,
    privacy: 'banned',
    linked: false,
    discord: null,
  });

  await sendEmail({
    to: userData.email,
    subject: '🚫 You’ve been banned from thebiolink.lol',
    html: `
      <h1>You’ve been banned from thebiolink.lol</h1>
      <p>This action was synced from Discord.</p>
      <p>Community guidelines apply everywhere.</p>
    `,
  });

  console.log(`🔁 Ban synced for Discord ID: ${discordId}`);
};

/**
 * Sync an unban from Discord to the website.
 */
export const syncUnbanToWeb = async (discordId: string): Promise<void> => {
  const linkedRef = doc(db, 'linkedUsers', discordId);
  const linkedSnap = await getDoc(linkedRef);

  if (!linkedSnap.exists()) return;

  const userData = linkedSnap.data();
  const userRef = doc(db, 'users', userData.uid);
  const prevPrivacy = userData.previousPrivacy || 'public';

  await updateDoc(userRef, {
    banned: false,
    bannedAt: null,
    bannedBy: null,
    privacy: prevPrivacy,
    unBannedAt: new Date(),
  });

  await sendEmail({
    to: userData.email,
    subject: '✅ You’ve been unbanned from thebiolink.lol',
    html: `
      <h1>You’ve been unbanned</h1>
      <p>Welcome back to thebiolink.lol.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Log in now</a></p>
    `,
  });

  console.log(`🔁 Unban synced for Discord ID: ${discordId}`);
};
