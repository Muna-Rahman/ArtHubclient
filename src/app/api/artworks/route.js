import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";


const instantDirectUri = "mongodb://munaUser:munaSecure2026@cluster0-shard-00-00.lazrpvl.mongodb.net:27017/arthub-db?ssl=true&authSource=admin&appName=Cluster0";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(instantDirectUri, {
    connectTimeoutMS: 1000, 
    socketTimeoutMS: 30000,
  });

  await client.connect();
  const db = client.db("arthub-db");

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    
    const { db } = await connectToDatabase();
    
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
      { success: false, message: "Failed to load gallery data stream" },
      { status: 500 }
    );
  }
}