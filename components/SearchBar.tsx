"use client";

import { useState, useEffect } from "react";
import { usePlaylistStore } from "@/store/playlistStore";

interface Props {
  onSearch: (prompt: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const SUGGESTIONS_POOL = [
  "early rap in New York",
  "acid house Chicago 1987",
  "Brazilian bossa nova classics",
  "lo-fi hip hop study beats",
  "post-punk Berlin 80s",
  "90s jungle and drum & bass",
  "deep soul and Motown",
  "French house Filter Disco",
  "Japanese city pop essentials",
  "psychedelic rock 1969",
  "UK garage 2-step vibes",
  "Ethiopian jazz from the 70s",
  "Detroit techno origins",
  "Italo disco dancefloor",
  "minimal ambient soundscapes",
  "dub reggae fundamentals",
  "classic trance at 4am",
  "Afrobeat pioneers",
  "ska and rocksteady",
  "90s grunge and flannel",
];

export function SearchBar({ onSearch, loading, disabled }: Props) {
  const { setPrompt, prompt } = usePlaylistStore();
  const [input, setInput] = useState(prompt);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS_POOL.slice(0, 5));

  // Randomize suggestions on mount to avoid hydration mismatch
  useEffect(() => {
    const shuffled = [...SUGGESTIONS_POOL].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 5));
  }, []);

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
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-booth-accent hover:bg-booth-accent-dim disabled:opacity-40 text-black font-bold text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Digging...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
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
