const pool = require("../modules/pool");

const rejectNonAdmin = async (req, res, next) => {
  //Requires body.organization_id or params.orgid on all admin routes
  async function checkAdmin(body) {
    let adminAccess = false;
    if (Object.keys(body.body).length > 0) {
      const queryText = `SELECT "is_admin" FROM "user_account" WHERE "user_id" = $1 AND "organization_id" = $2`;

      await pool
        .query(queryText, [body.user.id, body.body.organization_id])
        .then((result) => {
          adminAccess = result.rows[0].is_admin;
          console.log("adminAccess :>> ", adminAccess);
        })
        .catch((error) => {
          console.log("error caught in get Admin with body :>> ", error);
        });
    } else if (Object.keys(body.params).length > 0) {
      const queryText = `SELECT "is_admin" FROM "user_account" WHERE "user_id" = $1 AND "organization_id" = $2`;

      await pool
        .query(queryText, [body.user.id, body.params.orgid])
        .then((result) => {
          adminAccess = result.rows[0].is_admin;
          console.log("adminAccess :>> ", adminAccess);
        })
        .catch((error) => {
          console.log("error caught in get Admin with body :>> ", error);
        });
    } else {
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
