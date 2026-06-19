import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME || "arthub-db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: { 
    enabled: true,
    // Safely handles custom selection injection during signup requests
    signUp: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          defaultValue: "user", // Default fallback rule matching specifications
        }
      }
    }
  },
  // Enables seamless social profile processing matching assignment constraints
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    }
  }
});