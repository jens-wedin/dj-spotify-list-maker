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

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[spotify] matchTrack failed (${res.status}):`, errText);
    return null;
  }

  const data = await res.json();
  const item = data?.tracks?.items?.[0];
  if (!item) {
    console.warn(`[spotify] no match found for: ${track.title} – ${track.artist}`);
    return null;
  }

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
  _userId: string,
  name: string,
  description: string,
  uris: string[],
  accessToken: string
): Promise<SavedPlaylist> {
  console.log(`[spotify] createPlaylist: creating "${name}" for user...`);

  // 1. Create empty public playlist explicitly
  const createRes = await fetch(
    `${SPOTIFY_API}/me/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: true,
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error(`[spotify] createPlaylist failed (${createRes.status}):`, err);
    throw new Error(`Failed to create playlist: ${err}`);
  }

  const playlist = await createRes.json();
  const ownerId = playlist.owner?.id;
  console.log(`[spotify] playlist created: ${playlist.id}. Owner: ${ownerId}, Public: ${playlist.public}`);

  // 2. Extra delay for propagation
  console.log("[spotify] waiting 2s for propagation...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 3. Add tracks in batches of 100
  for (let i = 0; i < uris.length; i += 100) {
    const batch = uris.slice(i, i + 100);
    console.log(`[spotify] adding ${batch.length} items to ${playlist.id}. First URI: ${batch[0]}`);

    // Update Feb 2026: Use /items instead of /tracks
    const addRes = await fetch(
      `${SPOTIFY_API}/playlists/${playlist.id}/items`,
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
      console.error(`[spotify] addItems failed (${addRes.status}):`, err);
      throw new Error(`Failed to add items: ${err}`);
    }
    console.log("[spotify] batch added successfully");
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
  if (!res.ok) {
    const errText = await res.text();
    console.error(`[spotify] getSpotifyUser failed (${res.status}):`, errText);
    throw new Error(`Failed to fetch Spotify user: ${errText}`);
  }
  const data = await res.json();
  return {
    id: data.id,
    displayName: data.display_name,
    // Note: 'product' field was removed in Feb 2026
  };
}
