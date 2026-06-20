import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const solidShardUri = "mongodb://munaUser:munaSecure2026@ac-tamanjz-shard-00-00.lazrpvl.mongodb.net:27017,ac-tamanjz-shard-00-01.lazrpvl.mongodb.net:27017,ac-tamanjz-shard-00-02.lazrpvl.mongodb.net:27017/suncart?ssl=true&replicaSet=atlas-3wuhtl-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(solidShardUri, {
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