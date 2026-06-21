import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    
    const client = await clientPromise;
    const db = client.db("arthub-db"); 
    
    const artworks = await db
      .collection("artworks")
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, artworks }, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load live gallery data streams" },
      { status: 500 }
    );
  }
}