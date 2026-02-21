"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-booth-muted text-xs animate-pulse">
        Loading session...
      </span>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3 text-xs text-booth-text-dim">
        <span>Logged in as {session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="text-booth-muted hover:text-booth-text transition-colors underline underline-offset-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("spotify")}
      className="flex items-center gap-2 bg-booth-accent hover:bg-booth-accent-dim text-black font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
    >
      <SpotifyIcon />
      Connect Spotify
    </button>
  );
}

function SpotifyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.278a.748.748 0 01-1.03.248c-2.818-1.723-6.365-2.114-10.542-1.158a.748.748 0 01-.354-1.452c4.57-1.045 8.492-.595 11.672 1.339a.748.748 0 01.254 1.023zm1.466-3.261a.936.936 0 01-1.287.308c-3.225-1.98-8.142-2.554-11.958-1.397a.936.936 0 01-.575-1.786c4.36-1.403 9.779-.724 13.512 1.588a.936.936 0 01.308 1.287zm.126-3.395c-3.868-2.296-10.248-2.508-13.939-1.387a1.122 1.122 0 01-.69-2.141c4.239-1.366 11.285-1.102 15.733 1.604a1.122 1.122 0 01-1.104 1.924z" />
    </svg>
  );
}
