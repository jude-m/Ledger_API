"use strict";
import { MongoClient } from 'mongodb';

export function getDb() {
    try {
        const mongoClient = new MongoClient("mongodb://localhost:27017");
        console.log('Connecting to MongoDB...');
        mongoClient.connect();
        console.log('Successfully connected to MongoDB!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
        process.exit();

    }
}