import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6953a117001bca96c3c9');

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = 'doctus_db';
export const COLLECTION_ID_CHATS = 'chats';
