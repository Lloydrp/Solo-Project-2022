const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const { rejectNonAdmin } = require("../modules/authentication-admin");

router.get("/types", rejectUnauthenticated, (req, res) => {
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

router.get("/titles/:orgid", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM "titles" WHERE "organization_id" = $1;`;

  pool
    .query(queryText, [req.params.orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error caught in GET titles :>> ", error);
    });
});

router.get("/checkorgname/:newname", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT "name" FROM "organizations" WHERE "name" = $1;`;

  pool
    .query(queryText, [req.params.newname])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error caught in GET checkorgname :>> ", error);
    });
});

router.get("/participants/:orgid", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT
    "events_participants"."event_id",
    json_agg(distinct jsonb_build_object(
    'ep_event_id',
    "events_participants"."event_id",
    'ep_user_id',
    "events_participants"."user_id",
    'ep_event_duty',
    "events_participants"."event_duty",
    'first_name',
    "user"."first_name",
    'last_name',
    "user"."last_name",
    'title_id',
    "user_account"."title_id",
    'title_name',
    "titles"."title_name")) AS "participant_info"
    FROM "events_participants"
    JOIN "events" ON "events"."id" = "events_participants"."event_id"
    JOIN "user" ON "events_participants"."user_id" = "user"."id"
    JOIN "user_account" ON "events"."organization_id" = "user_account"."organization_id"
    LEFT JOIN "titles" ON "titles"."id" = "user_account"."title_id"
    WHERE "events"."organization_id" = $1
    GROUP BY "events_participants"."event_id";`;

  pool
    .query(queryText, [req.params.orgid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error caught in GET participants :>> ", error);
    });
});

router.post("/", rejectUnauthenticated, (req, res) => {
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

router.post(
  "/addresource",
  rejectNonAdmin,
  rejectUnauthenticated,
  (req, res) => {
    const {
      file_name,
      file_url,
      type_id,
      user_id,
      organization_id,
      file_description,
    } = req.body;
    const queryText = `INSERT INTO "resources" ("file_name", "file_url", "file_type", "user_id", "organization_id", "file_description")
  VALUES ($1, $2, $3, $4, $5, $6);`;

    pool
      .query(queryText, [
        file_name,
        file_url,
        type_id,
        user_id,
        organization_id,
        file_description,
      ])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in POST add resource :>> ", error);
      });
  }
);

router.post("/addevent", rejectUnauthenticated, rejectNonAdmin, (req, res) => {
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

router.post(
  "/addparticipant",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const { username, event_duty, event_id } = req.body;
    const queryText = `INSERT INTO "events_participants" ("event_id", "user_id", "event_duty")
    SELECT $1, (SELECT "id" FROM "user" WHERE "username" = $2) , $3
    WHERE NOT EXISTS (SELECT "event_id","user_id" FROM "events_participants"
    WHERE "events_participants"."event_id" = $1 AND "events_participants"."user_id" = (SELECT "id" FROM "user" WHERE "username" = $2))
    RETURNING "id";`;

    pool
      .query(queryText, [event_id, username, event_duty])
      .then((result) => {
        res.send(result.rows).status(200);
      })
      .catch((error) => {
        res.sendStatus(404);
        console.log("error caught in POST add participant :>> ", error);
      });
  }
);

router.post("/addtoorg", rejectUnauthenticated, rejectNonAdmin, (req, res) => {
  const { organization_id, title_id, newUser } = req.body;
  const queryText = `INSERT INTO "user_account" ("user_id", "organization_id", "title_id")
  VALUES ((SELECT "id" FROM "user" WHERE "username" = $1), $2, $3)
  ON CONFLICT ("user_id", "organization_id") DO NOTHING;`;

  pool
    .query(queryText, [newUser, organization_id, title_id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error caught in POST add user to org :>> ", error);
    });
});

router.post("/addtitle", rejectUnauthenticated, rejectNonAdmin, (req, res) => {
  const { newTitle, organization_id } = req.body;
  const queryText = `INSERT INTO "titles" ("title_name", "organization_id")
  VALUES ($1, $2);`;

  pool
    .query(queryText, [newTitle, organization_id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error caught in POST add title :>> ", error);
    });
});

router.put("/events", rejectUnauthenticated, rejectNonAdmin, (req, res) => {
  const { id, event_name, event_description, start_event } = req.body;
  const queryText = `UPDATE "events"
    SET "event_name" = $1,
    "event_description" = $2,
    "start_event" = $3
    WHERE "id" = $4`;

  pool
    .query(queryText, [event_name, event_description, start_event, id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error caught in POST update event :>> ", error);
    });
});

router.put(
  "/updateparticipant",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const { event_id, user_id, event_duty } = req.body;
    const queryText = `UPDATE "events_participants"
    SET "event_duty" = $1
    WHERE "event_id" = $2 AND "user_id" = $3;`;

    pool
      .query(queryText, [event_duty, event_id, user_id])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in POST update participant :>> ", error);
      });
  }
);

router.delete(
  "/deleteevent/:orgid/:eventid",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `DELETE FROM "events_participants" WHERE "event_id" = $1;`;

    pool
      .query(queryText, [req.params.eventid])
      .then((result) => {
        const secondQueryText = `DELETE FROM "events" WHERE "id" = $1;`;

        pool
          .query(secondQueryText, [req.params.eventid])
          .then((result) => {
            res.sendStatus(200);
          })
          .catch((error) => {
            console.log(
              "error caught in second DELETE event query :>> ",
              error
            );
          });
      })
      .catch((error) => {
        console.log("error caught in first DELETE event query :>> ", error);
      });
  }
);

router.delete(
  "/deleteresource/:orgid/:resourceid",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `DELETE FROM "resources" WHERE "id" = $1;`;

    pool
      .query(queryText, [req.params.resourceid])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in first DELETE resource :>> ", error);
      });
  }
);

router.delete(
  "/deleteparticipant/:orgid/:eventid/:participantid",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `DELETE FROM "events_participants" WHERE "event_id" = $1 AND "user_id" = $2;`;

    pool
      .query(queryText, [req.params.eventid, req.params.participantid])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in DELETE event participant :>> ", error);
      });
  }
);

router.delete(
  "/removeuser/:orgid/:userid",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `DELETE FROM "user_account" WHERE "organization_id" = $1 AND "user_id" = $2;`;

    pool
      .query(queryText, [req.params.orgid, req.params.userid])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in DELETE user from org :>> ", error);
      });
  }
);

router.delete(
  "/removetitle/:orgid/:titleid",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `DELETE FROM "titles" WHERE "id" = $1;`;

    pool
      .query(queryText, [req.params.titleid])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in DELETE title :>> ", error);
      });
  }
);

router.put(
  "/changeorgname",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `UPDATE "organizations" SET "name" = $1 WHERE "id" = $2;`;

    pool
      .query(queryText, [req.body.newName, req.body.organization_id])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in changeorgname :>> ", error);
      });
  }
);

router.put(
  "/changeorgtype",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `UPDATE "organizations" SET "type_id" = $1 WHERE "id" = $2;`;

    pool
      .query(queryText, [req.body.newType, req.body.organization_id])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in changeorgtype :>> ", error);
      });
  }
);

router.put("/addadmin", rejectUnauthenticated, rejectNonAdmin, (req, res) => {
  const queryText = `UPDATE "user_account" SET "is_admin" = 'true' WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username" = $1) AND "organization_id" = $2;`;

  pool
    .query(queryText, [req.body.newAdmin, req.body.organization_id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error caught in addAdmin :>> ", error);
    });
});

router.put(
  "/removeadmin",
  rejectUnauthenticated,
  rejectNonAdmin,
  (req, res) => {
    const queryText = `UPDATE "user_account" SET "is_admin" = 'false' WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username" = $1) AND "organization_id" = $2;`;

    pool
      .query(queryText, [req.body.newAdmin, req.body.organization_id])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("error caught in addAdmin :>> ", error);
      });
  }
);

module.exports = router;
