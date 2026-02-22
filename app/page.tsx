"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePlaylistStore } from "@/store/playlistStore";
import { SearchBar } from "@/components/SearchBar";
import { TrackList } from "@/components/TrackList";
import { LoginButton } from "@/components/LoginButton";
import { SavePlaylistButton } from "@/components/SavePlaylistButton";
import type { DJTrack, PlaylistTrack } from "@/lib/types";

export default function Home() {
  const { data: session } = useSession();
  const { phase, tracks, setTracks, setPhase, setPlaylistName, prompt } =
    usePlaylistStore();
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(searchPrompt: string) {
    setError(null);
    setPhase("searching");

    const res = await fetch("/api/dj-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: searchPrompt }),
    });

    if (!res.ok) {
      setError("DJ search failed. Check your API key.");
      setPhase("idle");
      return;
    }

    const { tracks: djTracks } = (await res.json()) as { tracks: DJTrack[] };
    const playlistTracks: PlaylistTrack[] = djTracks.map((t) => ({
      ...t,
      spotifyMatch: null,
      matchStatus: "pending",
    }));
    setTracks(playlistTracks);
    setPlaylistName(searchPrompt);
    setPhase("editing");
  }

  async function handleMatchSpotify() {
    setError(null);
    setPhase("matching");

    const res = await fetch("/api/spotify-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracks }),
    });

    if (!res.ok) {
      setError("Spotify match failed. Make sure you are logged in.");
      setPhase("editing");
      return;
    }

    const { tracks: matched } = await res.json();
    setTracks(matched);
    setPhase("matched");
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-booth-text">
          What&apos;s the vibe tonight?
        </h1>
        <p className="text-booth-text-dim text-sm">
          Describe a genre, era, or mood — the DJ finds the tracks.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        loading={phase === "searching"}
        disabled={phase === "matching" || phase === "saving"}
      />

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Track list */}
      {(phase === "editing" || phase === "matched" || phase === "matching" || phase === "saving" || phase === "saved") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-booth-accent font-bold uppercase tracking-widest text-xs">
              {phase === "saved" ? "Playlist Saved" : phase === "matched" ? "Spotify Matched" : "DJ Pick —"}{" "}
              {tracks.length} tracks
            </h2>

            {/* Match button — only shown when logged in and editing */}
            {phase === "editing" && session && (
              <button
                onClick={handleMatchSpotify}
                className="text-xs bg-booth-accent hover:bg-booth-accent-dim text-black font-bold px-4 py-2 rounded transition-colors"
              >
                Match on Spotify
              </button>
            )}

            {/* Login nudge when not authenticated */}
            {phase === "editing" && !session && (
              <span className="text-booth-text-dim text-xs">
                Log in to match & save
              </span>
            )}
          </div>

          <TrackList />

          {/* Save — only when matched or saving or saved */}
          {(phase === "matched" || phase === "saving" || phase === "saved") && session && (
            <SavePlaylistButton />
          )}
        </div>
      )}

      {/* Auth bar */}
      <div className="flex justify-center">
        <LoginButton />
      </div>
    </div>
  );
}
