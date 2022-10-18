const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/types", (req, res) => {
  const queryText = `SELECT * FROM "organizations_types";`;

  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error caught in GET types :>> ", error);
    });
});

router.post("/", (req, res) => {
  const queryText = `INSERT INTO "organizations" ("name", "type_id")
  VALUES ($1, $2) RETURNING "id";`;

  pool
    .query(queryText, [req.body.name, req.body.type_id])
    .then((result) => {
      const newOrg = result.rows[0].id;
      const secondQueryText = `INSERT INTO "user_account" ("user_id", "organization_id")
      VALUES ($1, $2);`;

      pool
        .query(secondQueryText, [req.user.id, newOrg])
        .then((result) => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.log("error caught in second Query :>> ", error);
        });
    })
    .catch((error) => {
      console.log("error caught in POST organization :>> ", error);
    });
});

module.exports = router;
