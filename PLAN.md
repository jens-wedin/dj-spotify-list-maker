# DJ Spotify List Maker — Project Plan

## Overview

A web app where an AI DJ helps you discover music. You describe a vibe, era, or genre in plain language, the app finds matching artists and songs, lets you curate the list, then saves it directly to your Spotify account as a playlist.

---

## User Flow

```
1. User types a search prompt
   → e.g. "early rap in New York"

2. AI DJ searches the web and returns a curated list
   → Artists + Song titles with short context

3. User reviews and edits the list
   → Add, remove, or reorder tracks

4. App queries the Spotify API to match each track
   → Returns Spotify URIs, cover art, preview URLs

5. User sees the matched list and makes final edits
   → Flag unmatched tracks, swap for alternatives

6. User logs in to Spotify (OAuth)
   → Saves the list as a new Spotify playlist
```

---

## Tech Stack

| Layer       | Choice                        | Reason                                      |
|-------------|-------------------------------|---------------------------------------------|
| Frontend    | **Next.js 14** (App Router)   | SSR + API routes in one project             |
| Styling     | **Tailwind CSS**              | Fast, utility-first, easy dark mode         |
| Language    | **TypeScript**                | Type safety across front and back           |
| AI/Search   | **Claude API** (Anthropic)    | Acts as the DJ, curates music lists         |
| Spotify     | **Spotify Web API**           | Search tracks, create playlists             |
| Auth        | **NextAuth.js** (Spotify provider) | Handles Spotify OAuth flow             |
| State       | **Zustand** or React Context  | Lightweight client-side list management     |

---

## Project Structure

```
dj-spotify-list-maker/
├── app/
│   ├── layout.tsx              # Root layout, fonts, providers
│   ├── page.tsx                # Home — search input
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts   # NextAuth Spotify OAuth
│   │   ├── dj-search/
│   │   │   └── route.ts        # POST: Claude web search → track list
│   │   ├── spotify-match/
│   │   │   └── route.ts        # POST: match track list against Spotify
│   │   └── spotify-save/
│   │       └── route.ts        # POST: save playlist to Spotify account
│   └── playlist/
│       └── page.tsx            # Playlist editor page
├── components/
│   ├── SearchBar.tsx           # DJ prompt input
│   ├── TrackList.tsx           # Editable list of tracks
│   ├── TrackItem.tsx           # Single track row (edit/remove/reorder)
│   ├── SpotifyMatchBadge.tsx   # Shows match status + cover art
│   ├── SavePlaylistButton.tsx  # Triggers Spotify save
│   └── LoginButton.tsx         # Spotify login / logout
├── lib/
│   ├── claude.ts               # Anthropic API client + DJ prompt
│   ├── spotify.ts              # Spotify API helpers
│   └── types.ts                # Shared TypeScript types
├── store/
│   └── playlistStore.ts        # Zustand store for the current list
├── .env.local.example          # Template for required env vars
├── PLAN.md                     # This file
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Key Components

### 1. DJ Search (`/api/dj-search`)
- Accepts a user prompt
- Sends it to Claude with a system prompt that sets the DJ persona
- Claude performs a web search and responds with a structured JSON list:
  ```json
  [
    { "artist": "Grandmaster Flash", "title": "The Message", "note": "1982 Sugarhill Records classic" },
    { "artist": "Sugarhill Gang",    "title": "Rapper's Delight", "note": "One of the first rap records to chart" }
  ]
  ```

### 2. Track List Editor
- Drag-and-drop reordering (via `@dnd-kit/core`)
- Inline rename for artist/title
- Delete individual tracks
- Manually add a track row

### 3. Spotify Match (`/api/spotify-match`)
- For each track in the list, calls `GET /v1/search?q=...&type=track`
- Returns best match: Spotify URI, cover art, preview URL, explicit flag
- Unmatched tracks are flagged so the user can fix them manually

### 4. Spotify Save (`/api/spotify-save`)
- Creates a new playlist on the user's account via `POST /v1/users/{user_id}/playlists`
- Adds matched tracks via `POST /v1/playlists/{playlist_id}/tracks`
- Returns the Spotify playlist URL

### 5. Auth (NextAuth + Spotify)
- Scopes required:
  - `playlist-modify-public`
  - `playlist-modify-private`
  - `user-read-private`
  - `user-read-email`
- Access token stored in session, refreshed automatically

---

## Environment Variables (`.env.local`)

```env
# Anthropic
ANTHROPIC_API_KEY=

# Spotify OAuth
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Optional: for web search tool in Claude
# (Claude's built-in web search or a custom Serper/Brave key)
SEARCH_API_KEY=
```

---

## UI / UX Notes

- **Dark mode by default** — DJ booth aesthetic, dark background with accent colors
- **DJ persona copy** — headings like "What's the vibe tonight?" instead of "Search"
- **Progress indicators** — spinner while Claude is thinking, skeleton cards during Spotify match
- **Playlist name** — auto-generated from the prompt, user can rename before saving
- **Preview playback** — 30-second Spotify preview on hover/click (no Premium required)

---

## Implementation Phases

### Phase 1 — Foundation
- [ ] Initialize Next.js 14 project with TypeScript + Tailwind
- [ ] Set up `.env.local.example`
- [ ] Create shared types (`Track`, `SpotifyMatch`, `Playlist`)
- [ ] Basic layout and dark theme

### Phase 2 — DJ Search
- [ ] Build `SearchBar` component
- [ ] Implement `/api/dj-search` route with Claude API
- [ ] Define DJ system prompt
- [ ] Display raw result list

### Phase 3 — List Editor
- [ ] Build `TrackList` + `TrackItem` components
- [ ] Add/remove/rename tracks
- [ ] Drag-and-drop reorder

### Phase 4 — Spotify Integration
- [ ] Set up NextAuth with Spotify provider
- [ ] Implement `/api/spotify-match`
- [ ] Show match badges (cover art, confidence)
- [ ] Implement `/api/spotify-save`

### Phase 5 — Polish
- [ ] Loading states and error handling
- [ ] Preview playback
- [ ] Responsive mobile layout
- [ ] Playlist name editor

---

## Open Questions / Future Ideas

- Allow multiple searches to be merged into one playlist
- Export as a `.csv` or share as a link before saving to Spotify
- DJ "explanation" sidebar — why each track was picked
- Suggest similar tracks when a Spotify match fails
- Support Apple Music or Tidal as alternative save targets
