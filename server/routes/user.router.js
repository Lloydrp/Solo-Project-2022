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
  const queryText = `SELECT "user_account".*, "organizations"."name" AS "organization_name", "organizations"."type_id" AS "organization_type_id" FROM "user"
  JOIN "user_account" ON "user"."id" = "user_account"."user_id"
  JOIN "organizations" ON "organizations"."id" = "user_account"."organization_id" WHERE "user"."id" = $1
  GROUP BY "organizations"."name", "user_account"."id", "organizations"."type_id";`;

  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      req.user = {
        ...req.user,
        organization_array: result.rows,
      };
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
  const queryText = `SELECT "organizations"."id" AS "id",
  array_agg(DISTINCT "titles"."title_name") AS "titles",
  json_agg(DISTINCT "events".*) AS "events",
  json_agg(DISTINCT "messages".*) AS "messages",
  json_agg(DISTINCT "resources".*) AS "resources"
  FROM "organizations"
  LEFT JOIN "resources" ON "resources"."organization_id" = "organizations"."id"
  LEFT JOIN "events" ON "events"."organization_id" = "organizations"."id"
  LEFT JOIN "messages" ON "messages"."organization_id" = "organizations"."id"
  LEFT JOIN "titles" ON "titles"."organization_id" = "organizations"."id"
  WHERE "organizations"."id" = $1
  GROUP BY "organizations"."id";`;

  pool
    .query(queryText, [orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.status(500).send("Error in GET user_account");
      console.log("error caught in GET org by id :>> ", error);
    });
}); // End GET to retrieve user_account

// Handles selection of organization and getting all user_account
router.get("/choose/users/:orgid", rejectUnauthenticated, (req, res) => {
  const orgid = req.params.orgid;
  const queryText = `SELECT "organizations"."id",
    json_agg(json_build_object(
    'first_name',"user"."first_name",
    'last_name',"user"."last_name",
    'title', "user_account"."title_id",
    'is_admin', "user_account"."is_admin",
    'username', "user"."username",
    'user_id', "user_account"."user_id",
    'user_account_id', "user_account"."id")) AS "users"
    FROM "organizations"
    JOIN "user_account" ON "organizations"."id" = "user_account"."organization_id"
    JOIN "user" ON "user"."id" = "user_account"."user_id"
    WHERE "organizations"."id" = $1
    GROUP BY "organizations"."id";`;

  pool
    .query(queryText, [orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.status(500).send("Error in users of organization");
      console.log("error caught in GET org users :>> ", error);
    });
}); // End GET to retrieve organization users

// Begin GET to check if username is available
router.get("/checkusername/:newUsername", (req, res) => {
  const queryText = `SELECT "username" FROM "user" WHERE "username" = $1;`;

  pool
    .query(queryText, [req.params.newUsername])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.status(500).send("Error in GET to check username");
      console.log("error caught in GET available username :>> ", error);
    });
}); // End GET to check is username is available

// Begin GET to check if email is available
router.get("/checkemail/:newEmail", (req, res) => {
  const queryText = `SELECT "email" FROM "user" WHERE "email" = $1;`;

  pool
    .query(queryText, [req.params.newEmail])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.status(500).send("Error in GET to check if email is available");
      console.log("error caught in GET available email :>> ", error);
    });
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
}); // End GET to check if email is available

// Begin PUT to change username
router.put("/changeusername", rejectUnauthenticated, (req, res) => {
  const queryText = `UPDATE "user" SET "username" = $1 WHERE "id" = $2;`;

  pool
    .query(queryText, [req.body.newUsername, req.user.id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.status(500).send("Error in PUT to change user name");
      console.log("error caught in PUT changeusername :>> ", error);
    });
}); // End PUT to change username

// Begin PUT to change email
router.put("/changeemail", rejectUnauthenticated, (req, res) => {
  const queryText = `UPDATE "user" SET "email" = $1 WHERE "id" = $2;`;

  pool
    .query(queryText, [req.body.newEmail, req.user.id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.status(500).send("Error in PUT to change email");
      console.log("error caught in PUT changeemail :>> ", error);
    });
}); // End PUT to change email

// Begin PUT to change password
router.put("/changepassword", rejectUnauthenticated, (req, res) => {
  const newPassword = encryptLib.encryptPassword(req.body.newPassword);
  const queryText = `UPDATE "user" SET "password" = $1 WHERE "id" = $2;`;

  pool
    .query(queryText, [newPassword, req.user.id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.status(500).send("Error in PUT to change password");
      console.log("error caught in PUT changepassword :>> ", error);
    });
}); // End PUT to change password

module.exports = router;
