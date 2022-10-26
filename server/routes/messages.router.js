const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

// GET chat messages for only the organization id the user is logged into
router.get("/:orgid", (req, res) => {
  const queryText = `SELECT * FROM "messages" WHERE "organization_id" = $1 ORDER BY "id" LIMIT 100;`;

  pool
    .query(queryText, [req.params.orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      req.statusCode(500).send("Error in GET messages");
      console.log("error caught in GET messages :>> ", error);
    });
});

module.exports = router;
