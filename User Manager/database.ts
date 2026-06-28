import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const database: Pool = new Pool({ connectionString: process.env.POSTGRES_URL as string });
export default database;