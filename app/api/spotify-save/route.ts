import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPlaylist, getSpotifyUser } from "@/lib/spotify";
import type { PlaylistTrack } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as { accessToken?: string })?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, description, tracks } = await req.json() as {
    name: string;
    description: string;
    tracks: PlaylistTrack[];
  };

  const uris = tracks
    .filter((t) => t.matchStatus === "matched" && t.spotifyMatch)
    .map((t) => t.spotifyMatch!.uri);

  if (uris.length === 0) {
    return NextResponse.json(
      { error: "No matched tracks to save" },
      { status: 400 }
    );
  }

  try {
    const { id: userId } = await getSpotifyUser(accessToken);
    console.log(`[spotify-save] user: ${userId}`);
    const playlist = await createPlaylist(
      userId,
      name || "DJ Mix",
      description || "",
      uris,
      accessToken
    );
    console.log("[spotify-save] created playlist:", JSON.stringify(playlist, null, 2));
    return NextResponse.json({ playlist });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[spotify-save] error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
