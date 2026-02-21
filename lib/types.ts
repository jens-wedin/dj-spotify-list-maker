// A track as returned by the DJ (Claude) search
export interface DJTrack {
  id: string;
  artist: string;
  title: string;
  note?: string; // DJ's context — why this track was picked
}

// A Spotify match for a DJTrack
export interface SpotifyMatch {
  spotifyId: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  coverUrl: string | null;
  previewUrl: string | null;
  explicit: boolean;
  externalUrl: string;
}

// A track in the editable list, combining DJ data and optional Spotify match
export interface PlaylistTrack extends DJTrack {
  spotifyMatch: SpotifyMatch | null;
  matchStatus: "pending" | "matched" | "unmatched" | "skipped";
}

// The saved playlist result
export interface SavedPlaylist {
  id: string;
  name: string;
  url: string;
  trackCount: number;
}
