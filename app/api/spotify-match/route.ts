import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { matchTrack } from "@/lib/spotify";
import type { DJTrack, PlaylistTrack } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as { accessToken?: string })?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { tracks } = await req.json() as { tracks: DJTrack[] };

  if (!Array.isArray(tracks)) {
    return NextResponse.json({ error: "tracks must be an array" }, { status: 400 });
  }

  const results: PlaylistTrack[] = await Promise.all(
    tracks.map(async (track) => {
      const spotifyMatch = await matchTrack(track, accessToken);
      return {
        ...track,
        spotifyMatch,
        matchStatus: spotifyMatch ? "matched" : "unmatched",
      } as PlaylistTrack;
    })
  );

  return NextResponse.json({ tracks: results });
}
