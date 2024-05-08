import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

const DB_CONN_STRING="mongodb://localhost:27017"
const DB_NAME="MedicalCenter"
const USERS_COLLECTION_NAME="Users"

export const collections: { users?: mongoDB.Collection } = {}


export async function connectToDatabase () {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
    await client.connect();
    const db: mongoDB.Db = client.db(DB_NAME);
    const usersCollection: mongoDB.Collection = db.collection(USERS_COLLECTION_NAME);
    collections.users = usersCollection;
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
}
