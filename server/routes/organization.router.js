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
      const secondQueryText = `INSERT INTO "user_account" ("user_id", "organization_id", "is_admin")
      VALUES ($1, $2, 'true');`;

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

router.post("/addresource", (req, res) => {
  const { file_name, file_url, type_id, user_id, organization_id } = req.body;
  const queryText = `INSERT INTO "resources" ("file_name", "file_url", "file_type", "user_id", "organization_id")
  VALUES ($1, $2, $3, $4, $5);`;

  pool
    .query(queryText, [file_name, file_url, type_id, user_id, organization_id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error caught in POST add resource :>> ", error);
    });
});

router.post("/addevent", (req, res) => {
  console.log("req.body :>> ", req.body);
  const { event_name, event_description, start_event, organization_id } =
    req.body;
  const queryText = `INSERT INTO "events" ("event_name", "event_description", "start_event", "organization_id")
    VALUES ( $1 , $2 , $3, $4);`;

  pool
    .query(queryText, [
      event_name,
      event_description,
      start_event,
      organization_id,
    ])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error caught in POST add resource :>> ", error);
    });
});

module.exports = router;
