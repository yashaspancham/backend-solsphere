const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./system_data.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS system_reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          machine_id TEXT,
          os_type TEXT,
          checks TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  }
});

module.exports = db;
