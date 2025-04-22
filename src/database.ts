import * as mongodb from "mongodb"
import config, { Config } from "./config"

class DatabaseError extends Error {};

/**
 * Class representing the database connection and operations.
 */
class Database {
    public config: Config;
    private client: mongodb.MongoClient;
    private isConnected = false;

    /**
     * Constructs a new Database instance.
     * Throws an error if required environment variables are missing.
     */
    constructor(config: Config) {
        if (!process.env.DB_URI) {
            throw new DatabaseError("DB_URI is not defined in the environment variables");
        }
        if (!config.DATABASE_NAME) {
            throw new DatabaseError("Database name is not defined in the configuration");
        }
        this.config = config;
        this.client = new mongodb.MongoClient(process.env.DB_URI, {
            serverApi: {
                version: mongodb.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
    }

    /**
     * Connects to the database.
     * @throws DatabaseError if the connection fails.
     */
    public async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
            console.log("Connected to the database");  
        }
    }

    /**
     * Disconnects from the database.
     * @throws DatabaseError if the disconnection fails.
     */
    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            console.log("Closed database connection");
        }
    }

    /**
     * Retrieves the database instance.
     * @returns The MongoDB database instance.
     * @throws DatabaseError if the client is not connected.
     */
    public getDb(): mongodb.Db {
        if (!this.isConnected) {
            throw new DatabaseError("Database client is not connected. Call connect() first.");
        }
        return this.client.db(this.config.DATABASE_NAME);
    }
}

export {Database, DatabaseError};
