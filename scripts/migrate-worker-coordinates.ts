/**
 * Migration script: Convert string-based latitude/longitude to GeoJSON format
 *
 * Run with: npm run migrate:worker-coordinates
 * Or: npx tsx scripts/migrate-worker-coordinates.ts
 *
 * Loads MONGODB_URI from .env.local (create from .env.example if needed)
 */

import mongoose from "mongoose";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env.local if it exists (Next.js convention)
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const env = readFileSync(envPath, "utf8");
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI environment variable is required");
  process.exit(1);
}

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected.\n");

  const db = mongoose.connection.db;
  if (!db) {
    console.error("Database connection not available");
    process.exit(1);
  }

  const workersCollection = db.collection("workers");
  const workers = await workersCollection.find({}).toArray();

  console.log(`Found ${workers.length} worker(s) to process.\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const worker of workers) {
    try {
      const latRaw = worker.latitude;
      const lngRaw = worker.longitude;

      // Parse to numbers (handles string "12.9716", number, or undefined)
      const lat = latRaw != null ? parseFloat(String(latRaw)) : 0;
      const lng = lngRaw != null ? parseFloat(String(lngRaw)) : 0;

      // Skip if already in correct format (location exists and has valid coordinates)
      const existingLocation = worker.location;
      if (
        existingLocation?.type === "Point" &&
        Array.isArray(existingLocation.coordinates) &&
        existingLocation.coordinates.length === 2 &&
        typeof worker.latitude === "number" &&
        typeof worker.longitude === "number"
      ) {
        skipped++;
        continue;
      }

      // Skip invalid coordinates (0,0 might mean no location set)
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`  Skipping worker ${worker._id}: invalid coordinates (${latRaw}, ${lngRaw})`);
        skipped++;
        continue;
      }

      await workersCollection.updateOne(
        { _id: worker._id },
        {
          $set: {
            location: {
              type: "Point",
              coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
            },
            latitude: lat,
            longitude: lng,
          },
        }
      );

      migrated++;
      console.log(`  Migrated worker ${worker._id}: (${lat}, ${lng}) -> location.coordinates`);
    } catch (err) {
      errors++;
      console.error(`  Error migrating worker ${worker._id}:`, err);
    }
  }

  console.log("\n--- Migration complete ---");
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors}`);

  if (migrated > 0) {
    console.log("\nCreating 2dsphere index on location (if not exists)...");
    await workersCollection.createIndex({ location: "2dsphere" });
    console.log("Index created.");
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
  process.exit(errors > 0 ? 1 : 0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
