"use client";

import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { usePlaylistStore } from "@/store/playlistStore";
import type { PlaylistTrack } from "@/lib/types";

interface Props {
  track: PlaylistTrack;
  index: number;
}

export function TrackItem({ track, index }: Props) {
  const { updateTrack, removeTrack, phase } = usePlaylistStore();
  const [editing, setEditing] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function togglePreview() {
    if (!track.spotifyMatch?.previewUrl) return;
    if (previewPlaying) {
      audioRef.current?.pause();
      setPreviewPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(track.spotifyMatch.previewUrl);
        audioRef.current.onended = () => setPreviewPlaying(false);
      }
      audioRef.current.play();
      setPreviewPlaying(true);
    }
  }

  const matchColor =
    track.matchStatus === "matched"
      ? "border-booth-accent"
      : track.matchStatus === "unmatched"
      ? "border-red-800"
      : "border-booth-border";

  const isEditable = phase === "editing" || phase === "matched";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 bg-booth-card border ${matchColor} rounded-lg p-3 group transition-colors`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-booth-border hover:text-booth-muted mt-1 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripIcon />
      </button>

      {/* Index */}
      <span className="text-booth-muted text-xs w-5 shrink-0 mt-1">
        {index + 1}
      </span>

      {/* Cover art (when matched) */}
      {track.spotifyMatch?.coverUrl ? (
        <button onClick={togglePreview} className="shrink-0 relative w-10 h-10">
          <Image
            src={track.spotifyMatch.coverUrl}
            alt="cover"
            width={40}
            height={40}
            className="rounded"
          />
          {track.spotifyMatch.previewUrl && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded text-white text-xs">
              {previewPlaying ? "■" : "▶"}
            </span>
          )}
        </button>
      ) : (
        <div className="w-10 h-10 shrink-0 bg-booth-surface rounded flex items-center justify-center text-booth-border text-xs">
          ♪
        </div>
      )}

      {/* Track info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {editing ? (
          <>
            <input
              autoFocus
              value={track.title}
              onChange={(e) => updateTrack(track.id, { title: e.target.value })}
              className="w-full bg-booth-surface border border-booth-accent rounded px-2 py-0.5 text-sm text-booth-text focus:outline-none"
              placeholder="Title"
            />
            <input
              value={track.artist}
              onChange={(e) =>
                updateTrack(track.id, { artist: e.target.value })
              }
              className="w-full bg-booth-surface border border-booth-border rounded px-2 py-0.5 text-xs text-booth-text-dim focus:outline-none mt-1"
              placeholder="Artist"
            />
          </>
        ) : (
          <>
            <p className="text-sm text-booth-text truncate font-medium">
              {track.title || <span className="text-booth-muted italic">Untitled</span>}
            </p>
            <p className="text-xs text-booth-text-dim truncate">
              {track.artist || <span className="text-booth-muted italic">Unknown artist</span>}
            </p>
          </>
        )}

        {track.note && !editing && (
          <p className="text-xs text-booth-muted line-clamp-1">{track.note}</p>
        )}

        {/* Spotify link */}
        {track.spotifyMatch?.externalUrl && (
          <a
            href={track.spotifyMatch.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-booth-accent hover:underline"
          >
            Open in Spotify
          </a>
        )}

        {/* Unmatched badge */}
        {track.matchStatus === "unmatched" && (
          <span className="text-xs text-red-400">Not found on Spotify</span>
        )}
      </div>

      {/* Actions */}
      {isEditable && (
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(!editing)}
            className="text-booth-muted hover:text-booth-text text-xs"
            aria-label={editing ? "Done editing" : "Edit track"}
          >
            {editing ? "Done" : "Edit"}
          </button>
          <button
            onClick={() => removeTrack(track.id)}
            className="text-booth-muted hover:text-red-400 text-xs"
            aria-label="Remove track"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function GripIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}
