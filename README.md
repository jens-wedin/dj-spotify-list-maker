# DJ Spotify List Maker

An AI-powered music discovery and playlist creation app. Describe a vibe, genre, or era in plain language and an AI DJ (Gemini) curates a tracklist for you — then save it directly to your Spotify account.

## How it works

1. Type a music prompt (e.g. "early rap in New York" or "dark ambient electronica 2000s")
2. The AI DJ researches and returns a curated list of 10–20 tracks with context
3. Review, reorder, edit, or remove tracks via drag-and-drop
4. Log in with Spotify and save the playlist to your account

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **AI:** Google Gemini API (gemini-2.0-flash)
- **Auth:** NextAuth.js with Spotify OAuth
- **Music:** Spotify Web API
- **Drag & Drop:** dnd-kit

## Getting started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- A [Spotify Developer app](https://developer.spotify.com/dashboard) (client ID + secret)

### Installation

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=  # generate with: openssl rand -base64 32
```

In your Spotify Developer Dashboard, add `http://localhost:3000/api/auth/callback/spotify` as a redirect URI.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  api/
    auth/          # NextAuth Spotify OAuth handler
    dj-search/     # Gemini AI track generation
    spotify-match/ # Match AI tracks to Spotify catalog
    spotify-save/  # Create and save playlist
  page.tsx         # Main UI
components/
  SearchBar.tsx
  TrackList.tsx    # Drag-drop sortable list
  TrackItem.tsx    # Individual track with edit/delete
  SavePlaylistButton.tsx
  LoginButton.tsx
lib/
  claude.ts        # Gemini client & DJ system prompt
  spotify.ts       # Spotify API helpers
  auth.ts          # NextAuth config & token refresh
  types.ts
store/
  playlistStore.ts # Zustand store
```

## License

MIT
