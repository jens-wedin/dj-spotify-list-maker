import { NextRequest, NextResponse } from "next/server";
import { djSearch } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const tracks = await djSearch(prompt.trim());
  return NextResponse.json({ tracks });
}
