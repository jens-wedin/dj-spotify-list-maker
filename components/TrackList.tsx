"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { usePlaylistStore } from "@/store/playlistStore";
import { TrackItem } from "./TrackItem";

export function TrackList() {
  const { tracks, reorderTracks, addTrack, phase } = usePlaylistStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = tracks.findIndex((t) => t.id === active.id);
    const to = tracks.findIndex((t) => t.id === over.id);
    reorderTracks(from, to);
  }

  function handleAddTrack() {
    addTrack({
      id: `manual-${Date.now()}`,
      artist: "",
      title: "",
      note: "",
      spotifyMatch: null,
      matchStatus: "pending",
    });
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tracks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tracks.map((track, index) => (
            <TrackItem key={track.id} track={track} index={index} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add track row — only available while editing or after matching */}
      {(phase === "editing" || phase === "matched") && (
        <button
          onClick={handleAddTrack}
          className="w-full text-xs text-booth-muted hover:text-booth-text border border-dashed border-booth-border hover:border-booth-accent rounded-lg py-2 transition-colors"
        >
          + Add track
        </button>
      )}
    </div>
  );
}
