import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGO_DB_URI;
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
          required: true,
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