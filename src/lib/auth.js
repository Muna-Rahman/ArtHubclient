import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("Missing MONGO_DB_URI inside your environment configuration.");
}

const client = new MongoClient(uri, {
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
});

const db = client.db("arthub-db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  

  emailAndPassword: { 
    enabled: true,
    signUp: {
      additionalFields: {
        role: {
          type: "string",
          required: false, 
          defaultValue: "user",
        }
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  }
});