// lib/mongodb.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

let client;
let clientPromise<any>;

if (!global._mongoClientPromise<any>) {
  client = new MongoClient(uri);
  global._mongoClientPromise<any> = client.connect();
}

clientPromise<any> = global._mongoClientPromise<any>;

export default clientPromise<any>;
