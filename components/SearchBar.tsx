"use client";

import { useState } from "react";
import { usePlaylistStore } from "@/store/playlistStore";

interface Props {
  onSearch: (prompt: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "early rap in New York",
  "acid house Chicago 1987",
  "Brazilian bossa nova classics",
  "lo-fi hip hop study beats",
  "post-punk Berlin 80s",
];

export function SearchBar({ onSearch, loading, disabled }: Props) {
  const { setPrompt, prompt } = usePlaylistStore();
  const [input, setInput] = useState(prompt);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || disabled) return;
    setPrompt(input.trim());
    onSearch(input.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. early rap in New York..."
          disabled={loading || disabled}
          className="w-full bg-booth-surface border border-booth-border rounded-lg px-4 py-3 pr-24 text-booth-text placeholder-booth-muted focus:outline-none focus:border-booth-accent transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || disabled || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-booth-accent hover:bg-booth-accent-dim disabled:opacity-40 text-black font-bold text-xs px-3 py-1.5 rounded transition-colors"
        >
          {loading ? "Digging..." : "Search"}
        </button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInput(s)}
            disabled={loading || disabled}
            className="text-xs text-booth-text-dim border border-booth-border rounded-full px-3 py-1 hover:border-booth-accent hover:text-booth-text transition-colors disabled:opacity-30"
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}
