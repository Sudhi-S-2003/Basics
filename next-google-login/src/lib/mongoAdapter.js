import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise<any> from "./mongodb";

export const adapter = MongoDBAdapter(clientPromise<any>);
