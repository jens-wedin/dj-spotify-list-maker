import type { DJTrack, SpotifyMatch, SavedPlaylist } from "./types";

const SPOTIFY_API = "https://api.spotify.com/v1";

// ── Search ────────────────────────────────────────────────────────────────────

export async function matchTrack(
  track: DJTrack,
  accessToken: string
): Promise<SpotifyMatch | null> {
  const q = encodeURIComponent(`track:${track.title} artist:${track.artist}`);
  const url = `${SPOTIFY_API}/search?q=${q}&type=track&limit=1`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const item = data?.tracks?.items?.[0];
  if (!item) return null;

  return {
    spotifyId: item.id,
    uri: item.uri,
    name: item.name,
    artist: item.artists.map((a: { name: string }) => a.name).join(", "),
    album: item.album.name,
    coverUrl: item.album.images?.[0]?.url ?? null,
    previewUrl: item.preview_url ?? null,
    explicit: item.explicit,
    externalUrl: item.external_urls?.spotify ?? "",
  };
}

// ── Create playlist ───────────────────────────────────────────────────────────

export async function createPlaylist(
  userId: string,
  name: string,
  description: string,
  uris: string[],
  accessToken: string
): Promise<SavedPlaylist> {
  // 1. Create empty playlist
  const createRes = await fetch(
    `${SPOTIFY_API}/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create playlist: ${err}`);
  }

  const playlist = await createRes.json();

  // 2. Add tracks in batches of 100 (Spotify limit)
  for (let i = 0; i < uris.length; i += 100) {
    const batch = uris.slice(i, i + 100);
    const addRes = await fetch(
      `${SPOTIFY_API}/playlists/${playlist.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: batch }),
      }
    );
    if (!addRes.ok) {
      const err = await addRes.text();
      throw new Error(`Failed to add tracks: ${err}`);
    }
  }

  return {
    id: playlist.id,
    name: playlist.name,
    url: playlist.external_urls?.spotify ?? "",
    trackCount: uris.length,
  };
}

// ── Get current user ──────────────────────────────────────────────────────────

export async function getSpotifyUser(
  accessToken: string
): Promise<{ id: string; displayName: string }> {
  const res = await fetch(`${SPOTIFY_API}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Spotify user");
  const data = await res.json();
  return { id: data.id, displayName: data.display_name };
}
