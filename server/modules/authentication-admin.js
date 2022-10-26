const pool = require("../modules/pool");

// Creating middleware to verify if user is admin for current organization
const rejectNonAdmin = async (req, res, next) => {
  //Requires body.organization_id or params.orgid on all admin routes
  async function checkAdmin(body) {
    // Setup default boolean (reject all unless proven true)
    let adminAccess = false;
    // Checking if the route us using req.body
    if (Object.keys(body.body).length > 0) {
      const queryText = `SELECT "is_admin" FROM "user_account" WHERE "user_id" = $1 AND "organization_id" = $2`;

      await pool
        .query(queryText, [body.user.id, body.body.organization_id])
        .then((result) => {
          // Sets adminAccess to boolean stored in database
          adminAccess = result.rows[0].is_admin;
        })
        .catch((error) => {
          res.status(500).send("Error checking admin with req.body");
          console.log("error caught in get Admin with body :>> ", error);
        });
      // Check if route is using req.params if not req.body
    } else if (Object.keys(body.params).length > 0) {
      const queryText = `SELECT "is_admin" FROM "user_account" WHERE "user_id" = $1 AND "organization_id" = $2`;

      await pool
        .query(queryText, [body.user.id, body.params.orgid])
        .then((result) => {
          // Sets adminAccess to boolean stored in database
          adminAccess = result.rows[0].is_admin;
        })
        .catch((error) => {
          res.status(500).send("Error checking admin with req.params");
          console.log("error caught in get Admin with body :>> ", error);
        });
    } else {
      res.status(500).send("Error checking admin in pool");
      console.log("Error in pool");
      adminAccess = false;
    }
    return adminAccess;
  }
  const access = await checkAdmin(req);
  // check if logged in
  if (access) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

module.exports = { rejectNonAdmin };
