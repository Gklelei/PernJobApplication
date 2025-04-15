import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const sql = mysql.createPool(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, casing: "snake_case" });
