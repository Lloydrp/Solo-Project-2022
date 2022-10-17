const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT "user_account".* AS "id", "organizations"."name" AS "organization_name" from "user"
    JOIN "user_account" ON "user"."id" = "user_account"."user_id"
    JOIN "organizations" ON "organizations"."id" = "user_account"."organization_id" WHERE "user"."id" = $1
    GROUP BY "organizations"."name", "user_account"."id";`;

  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      req.user = { ...req.user, organization_array: result.rows };
      res.send(req.user);
    })
    .catch((error) => {
      console.log("error caught in GET user_account_org :>> ", error);
    });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const registerInfo = req.body;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password, first_name, last_name, email)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
  pool
    .query(queryText, [
      registerInfo.username,
      password,
      registerInfo.first_name,
      registerInfo.last_name,
      registerInfo.email,
    ])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// Handles selection of organization and getting correct user_account
router.get("/choose/:orgid", rejectUnauthenticated, (req, res) => {
  const orgid = req.params.orgid;
  const queryText = `SELECT "user_account".* AS "id", "organizations"."name" AS "organization_name" from "user"
JOIN "user_account" ON "user"."id" = "user_account"."user_id"
JOIN "organizations" ON "organizations"."id" = "user_account"."organization_id" WHERE "user"."id" = $1
GROUP BY "organizations"."name", "user_account"."id";`;

  pool
    .query(queryText, [orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error caught in GET user_account_org :>> ", error);
    });
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
