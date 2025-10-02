import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, Promise<any>: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.Promise<any>) {
    cached.Promise<any> = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.Promise<any>;
  return cached.conn;
}
