"use client";

import { useState } from "react";
import { usePlaylistStore } from "@/store/playlistStore";

export function SavePlaylistButton() {
  const { tracks, playlistName, setPlaylistName, setPhase, setSavedUrl, phase } =
    usePlaylistStore();
  const [saving, setSaving] = useState(false);
  const [savedUrl, setLocalSavedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const matchedCount = tracks.filter((t) => t.matchStatus === "matched").length;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setPhase("saving");

    const res = await fetch("/api/spotify-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playlistName,
        description: `Created by DJ List Maker`,
        tracks,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      let errorMsg = "Save failed";
      try {
        const body = JSON.parse(text);
        errorMsg = body.error ?? errorMsg;
      } catch {
        if (text) errorMsg = text;
      }
      setError(errorMsg);
      setPhase("matched");
      setSaving(false);
      return;
    }

    const { playlist } = await res.json();
    setLocalSavedUrl(playlist.url);
    setSavedUrl(playlist.url);
    setPhase("saved");
    setSaving(false);
  }

  if (phase === "saved" && savedUrl) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <span className="text-booth-accent font-bold text-sm">Playlist saved!</span>
        <a
          href={savedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-booth-accent hover:bg-booth-accent-dim text-black font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
        >
          Open in Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Playlist name..."
          className="flex-1 bg-booth-surface border border-booth-border rounded-lg px-3 py-2 text-sm text-booth-text focus:outline-none focus:border-booth-accent transition-colors"
        />
        <button
          onClick={handleSave}
          disabled={saving || matchedCount === 0}
          className="bg-booth-accent hover:bg-booth-accent-dim disabled:opacity-40 text-black font-bold text-sm px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {saving ? "Saving..." : `Save ${matchedCount} tracks`}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {matchedCount < tracks.length && (
        <p className="text-booth-muted text-xs">
          {tracks.length - matchedCount} unmatched track(s) will be skipped.
        </p>
      )}
    </div>
  );
}
