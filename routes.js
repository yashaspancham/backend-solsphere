const express = require("express");
const db = require("./db");
const router = express.Router();
const authMiddleware = require("./middleware");

// POST new report
router.post("/reports", authMiddleware, (req, res) => {
  const { report } = req.body;
  const machine_id = report.machine_id;
  const os_type = report.os_type;
  const checks = report.checks;
  console.log("machine_id:", machine_id);
  console.log("os_type:", os_type);
  console.log("checks:", checks);
  console.log("systemRunCheckAt:",report["lastCheckedAt"])
  const query = `INSERT INTO system_reports (machine_id, os_type, checks) VALUES (?, ?, ?)`;
  db.run(query, [machine_id, os_type, JSON.stringify(checks)], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, machine_id, os_type, checks, timestamp: new Date() });
  });
});

// GET all reports
router.get("/reports",authMiddleware, (req, res) => {
  db.all(`SELECT * FROM system_reports`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, checks: JSON.parse(r.checks) })));
  });
});


// GET latest report per machine
router.get("/reports/latest",authMiddleware, (req, res) => {
  const query = `
    SELECT r1.*
    FROM system_reports r1
    INNER JOIN (
      SELECT machine_id, MAX(id) as max_id
      FROM system_reports
      GROUP BY machine_id
    ) r2 ON r1.id = r2.max_id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, checks: JSON.parse(r.checks) })));
  });
});

// GET distinct OS types
router.get("/os-types",authMiddleware, (req, res) => {
  console.log("/os-types was called");
  const query = `SELECT DISTINCT os_type FROM system_reports WHERE os_type IS NOT NULL`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const osTypes = rows.map(r => r.os_type);
    console.log("Distinct OS types:", osTypes);
    res.json({ osTypes });
  });
});


// GET all machine_ids for a given OS type
router.get("/machines/:osType",authMiddleware, (req, res) => {
  const { osType } = req.params;

  const query = `
    SELECT DISTINCT machine_id
    FROM system_reports
    WHERE os_type = ? AND machine_id IS NOT NULL
  `;

  db.all(query, [osType], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const machineIds = rows.map(r => r.machine_id);
    res.json({ osType, machineIds });
  });
});

// GET history (timestamps + checks) for a machine
router.get("/reports/:machineId/history",authMiddleware, (req, res) => {
  const { machineId } = req.params;

  const query = `
    SELECT timestamp, checks
    FROM system_reports
    WHERE machine_id = ? 
    AND checks IS NOT NULL
    ORDER BY timestamp ASC
  `;

  db.all(query, [machineId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const history = rows.map(r => ({
      timestamp: r.timestamp,
      checks: JSON.parse(r.checks),
    }));

    res.json({ machineId, history });
  });
});


module.exports = router;