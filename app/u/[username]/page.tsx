import { notFound } from 'next/navigation';

// Mock data — in production, fetch from Firebase
const profiles = {
  yourname: {
    name: "John Doe",
    bio: "Content Creator • Photographer",
    avatar: "https://via.placeholder.com/150",
    links: [
      { id: 1, label: "Instagram", url: "https://instagram.com", clicks: 124 },
      { id: 2, label: "YouTube", url: "https://youtube.com", clicks: 89 },
      { id: 3, label: "TikTok", url: "https://tiktok.com", clicks: 203 },
    ],
  },
};

export default function UserProfile({ params }: { params: { username: string } }) {
  const profile = profiles[params.username];

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs text-center">
        <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
        <p className="text-gray-600 mb-6">{profile.bio}</p>
        <div className="space-y-3">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-mybio-primary text-white py-3 px-6 rounded-full font-medium hover:bg-opacity-90 transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500">mybio.com</p>
    </div>
  );
}
