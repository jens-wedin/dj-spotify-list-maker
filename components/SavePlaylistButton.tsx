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
    console.log("[SavePlaylistButton] handleSave started");
    setSaving(true);
    setError(null);
    setPhase("saving");

    try {
      const res = await fetch("/api/spotify-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playlistName,
          description: `Created by DJ List Maker`,
          tracks,
        }),
      });

      console.log("[SavePlaylistButton] fetch response status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("[SavePlaylistButton] save failed text:", text);
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

      const data = await res.json();
      console.log("[SavePlaylistButton] save success data:", data);
      const { playlist } = data;
      setLocalSavedUrl(playlist.url);
      setSavedUrl(playlist.url);
      setPhase("saved");
      console.log("[SavePlaylistButton] phase set to saved");
    } catch (err) {
      console.error("[SavePlaylistButton] fetch error:", err);
      setError("Network or server error");
      setPhase("matched");
    } finally {
      setSaving(false);
      console.log("[SavePlaylistButton] saving set to false");
    }
  }

  if (phase === "saved" && savedUrl) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-booth-surface/50 rounded-2xl border border-booth-accent/20 animate-in fade-in zoom-in duration-500">
        <div className="text-4xl mb-2">🎧🕺✨</div>
        <div className="text-center space-y-1">
          <h3 className="text-booth-accent font-black text-xl tracking-tight">MIX DROPPED!</h3>
          <p className="text-booth-text-dim text-sm">Your playlist is live on Spotify.</p>
        </div>
        <a
          href={savedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-booth-accent hover:bg-booth-accent-dim text-black font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-booth-accent/20"
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
          className="bg-booth-accent hover:bg-booth-accent-dim disabled:opacity-40 text-black font-bold text-sm px-5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 min-w-[140px] justify-center"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            `Save ${matchedCount} tracks`
          )}
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
