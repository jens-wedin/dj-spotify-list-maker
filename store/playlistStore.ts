import { create } from "zustand";
import type { PlaylistTrack } from "@/lib/types";

interface PlaylistState {
  prompt: string;
  playlistName: string;
  tracks: PlaylistTrack[];
  phase: "idle" | "searching" | "editing" | "matching" | "matched" | "saving" | "saved";
  savedUrl: string | null;

  setPrompt: (prompt: string) => void;
  setPlaylistName: (name: string) => void;
  setTracks: (tracks: PlaylistTrack[]) => void;
  setPhase: (phase: PlaylistState["phase"]) => void;
  setSavedUrl: (url: string) => void;

  updateTrack: (id: string, patch: Partial<PlaylistTrack>) => void;
  removeTrack: (id: string) => void;
  addTrack: (track: PlaylistTrack) => void;
  reorderTracks: (from: number, to: number) => void;
  reset: () => void;
}

const initialState = {
  prompt: "",
  playlistName: "",
  tracks: [],
  phase: "idle" as const,
  savedUrl: null,
};

export const usePlaylistStore = create<PlaylistState>((set) => ({
  ...initialState,

  setPrompt: (prompt) => set({ prompt }),
  setPlaylistName: (playlistName) => set({ playlistName }),
  setTracks: (tracks) => set({ tracks }),
  setPhase: (phase) => set({ phase }),
  setSavedUrl: (savedUrl) => set({ savedUrl }),

  updateTrack: (id, patch) =>
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  removeTrack: (id) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== id),
    })),

  addTrack: (track) =>
    set((state) => ({
      tracks: [...state.tracks, track],
    })),

  reorderTracks: (from, to) =>
    set((state) => {
      const tracks = [...state.tracks];
      const [moved] = tracks.splice(from, 1);
      tracks.splice(to, 0, moved);
      return { tracks };
    }),

  reset: () => set(initialState),
}));
