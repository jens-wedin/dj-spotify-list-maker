import { GoogleGenAI } from "@google/genai";
import type { DJTrack } from "./types";

const DJ_SYSTEM_PROMPT = `You are an expert DJ with encyclopedic knowledge of music history across all genres and eras.
When given a music search prompt, you research and return a curated playlist of 10–20 tracks that fit the vibe.
You always respond with a valid JSON array — no markdown fences, no extra commentary, just the JSON.

Each item in the array must have:
- "artist": string — the artist or group name
- "title": string  — the track title
- "note": string   — one sentence explaining why this track belongs (historical context, relevance, etc.)

Be specific and accurate. Make a mix of iconic or influential tracks and some obscure picks.`;

export async function djSearch(prompt: string): Promise<DJTrack[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find me tracks for: ${prompt}`,
    config: { systemInstruction: DJ_SYSTEM_PROMPT },
  });

  const text = (response.text ?? "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

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
