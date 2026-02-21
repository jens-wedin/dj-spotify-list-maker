import Anthropic from "@anthropic-ai/sdk";
import type { DJTrack } from "./types";

const DJ_SYSTEM_PROMPT = `You are an expert DJ with encyclopedic knowledge of music history across all genres and eras.
When given a music search prompt, you research and return a curated playlist of 10–20 tracks that fit the vibe.
You always respond with a valid JSON array — no markdown fences, no extra commentary, just the JSON.

Each item in the array must have:
- "artist": string — the artist or group name
- "title": string  — the track title
- "note": string   — one sentence explaining why this track belongs (historical context, relevance, etc.)

Be specific and accurate. Prefer iconic or influential tracks over obscure picks, but include a few gems.`;

export async function djSearch(prompt: string): Promise<DJTrack[]> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: DJ_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Find me tracks for: ${prompt}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const raw = JSON.parse(text) as Array<{
    artist: string;
    title: string;
    note?: string;
  }>;

  return raw.map((item, index) => ({
    id: `dj-${Date.now()}-${index}`,
    artist: item.artist,
    title: item.title,
    note: item.note,
  }));
}
