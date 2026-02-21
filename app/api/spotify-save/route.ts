import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createPlaylist, getSpotifyUser } from "@/lib/spotify";
import type { PlaylistTrack } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
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

  const { id: userId } = await getSpotifyUser(accessToken);
  const playlist = await createPlaylist(
    userId,
    name || "DJ Mix",
    description || "",
    uris,
    accessToken
  );

  return NextResponse.json({ playlist });
}
