import path from "node:path";
import { promises as fs } from "node:fs";
import { Client } from "pg";
import dotenv from "dotenv";

import { Env } from "../app/Domain/Entities/Env";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const env = new Env();

if (env.dbType !== "postgres") {
  console.error(
    `DB_TYPE must be set to "postgres" to run these migrations. Current value: ${env.dbType}`
  );
  process.exit(1);
}

const client = new Client({
  host: env.dbHost,
  port: Number(env.dbPort),
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  ssl: { rejectUnauthorized: false },
});

const migrationsDir = path.resolve(
  __dirname,
  "../../devops/postgresql/migrations"
);

async function migrationsTableExists(): Promise<boolean> {
  const { rows } = await client.query<{ exists: boolean }>(
    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migrations') AS exists"
  );
  return rows[0]?.exists ?? false;
}

async function migrationAlreadyApplied(
  migrationName: string
): Promise<boolean> {
  const { rows } = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM migrations WHERE migration_name = $1",
    [migrationName]
  );
  return Number(rows[0]?.count ?? "0") > 0;
}

async function readMigrationFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(migrationsDir);
    return entries
      .filter((name) => name.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    throw new Error(
      `Unable to read migrations directory at ${migrationsDir}: ${(error as Error).message}`
    );
  }
}

async function runMigration(
  fileName: string,
  skipCheck: boolean
): Promise<void> {
  const fullPath = path.join(migrationsDir, fileName);
  const migrationName = path.basename(fileName, ".sql");

  if (!skipCheck && (await migrationAlreadyApplied(migrationName))) {
    console.log(`Skipping ${migrationName} (already recorded).`);
    return;
  }

  const sql = await fs.readFile(fullPath, "utf8");

  console.log(`Running ${migrationName}...`);
  try {
    await client.query(sql);
    const tableExists = await migrationsTableExists();
    if (tableExists) {
      await client.query(
        "INSERT INTO migrations (migration_name, description) VALUES ($1, $2) ON CONFLICT (migration_name) DO NOTHING",
        [migrationName, `Migration file: ${migrationName}`]
      );
    }
    console.log(`Finished ${migrationName}.`);
  } catch (error) {
    console.error(`Migration ${migrationName} failed.`);
    throw error;
  }
}

async function main(): Promise<void> {
  console.log("Connecting to PostgreSQL...");
  await client.connect();
  console.log("Connection established.\n");

  const migrationFiles = await readMigrationFiles();
  if (migrationFiles.length === 0) {
    console.log("No migrations found.");
    return;
  }

  console.log("Migrations to process:");
  migrationFiles.forEach((file) => console.log(` - ${file}`));
  console.log("");

  let tableExists = await migrationsTableExists();

  for (const file of migrationFiles) {
    await runMigration(file, !tableExists);
    tableExists = await migrationsTableExists();
  }

  console.log("\nAll migrations completed successfully.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
