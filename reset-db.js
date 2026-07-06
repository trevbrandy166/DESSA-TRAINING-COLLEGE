const fs = require("fs");
const path = require("path");
const { initDb } = require("./database");

const DB_PATH = path.join(__dirname, "dessa.db");

// Delete existing database
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log("Old database deleted.");
}

// Recreate with new data
initDb();
console.log("Database reset with updated programs.");
