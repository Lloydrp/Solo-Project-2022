const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/:orgid", (req, res) => {
  const queryText = `SELECT * FROM "messages" WHERE "organization_id" = $1;`;
  pool
    .query(queryText, [req.params.orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error caught in GET messages :>> ", error);
    });
});

router.post("/", (req, res) => {
  // POST route code here
});

module.exports = router;
