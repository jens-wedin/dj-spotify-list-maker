import { NextRequest, NextResponse } from "next/server";
import { djSearch } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  try {
    const tracks = await djSearch(prompt.trim());
    return NextResponse.json({ tracks });
  } catch (err) {
    console.error("[dj-search]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
