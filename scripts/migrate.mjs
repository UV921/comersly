import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const db = drizzle(process.env.DATABASE_URL);

await migrate(db, { migrationsFolder: "./drizzle" });

console.log("Migrations applied");
