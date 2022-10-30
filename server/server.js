const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./modules/pool");
require("dotenv").config();

const app = express();

const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let chatUsers = {};

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route includes
const userRouter = require("./routes/user.router");
const orgRouter = require("./routes/organization.router");
const messageRouter = require("./routes/messages.router");

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use("/api/user", userRouter);
app.use("/api/organization", orgRouter);
app.use("/api/messages", messageRouter);

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Listens and logs the message to the console
  socket.on("message", (data) => {
    console.log("data :>> ", data);
    const queryText = `INSERT INTO "messages" ("message", "user_sent_id", "organization_id")
    VALUES ($1, $2, $3);`;
    pool
      .query(queryText, [data.message, data.user_sent_id, data.organization_id])
      .then((result) => {
        socketIO.emit("messageResponse", data);
      })
      .catch((error) => {
        console.log("error caught in post messages :>> ", error);
      });
    //NEED TO TEST
    socket.to(data.organization_id).emit("typingResponse", "");
  });

  //FIX GLOBAL SHOWING OF PERSON TYPING
  socket.on("typing", (data) =>
    socket.to(data.organization_id).emit("typingResponse", data)
  );

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    socket.join(data.organization_id);

    //Adds the new user to the list of users
    if (chatUsers[data.organization_id] === undefined) {
      chatUsers[data.organization_id] = [data];
    } else {
      chatUsers[data.organization_id].push(data);
    }
    // // console.log(chatUsers);
    // //Sends the list of users to the client
    socketIO
      .to(data.organization_id)
      .emit("newUserResponse", chatUsers[data.organization_id]);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    let foundOrg = "";
    const allOrgs = Object.keys(chatUsers);
    for (let i = 0; i < allOrgs.length; i++) {
      if (chatUsers[allOrgs[i]].some((user) => user.socketID === socket.id)) {
        foundOrg = allOrgs[i];
      }
    }
    if (foundOrg) {
      chatUsers[foundOrg] = chatUsers[foundOrg].filter(
        (user) => user.socketID !== socket.id
      );
    }
    // console.log(chatUsers);
    //Sends the list of users to the client
    socketIO.to(foundOrg).emit("newUserResponse", chatUsers[foundOrg]);
    socket.leave(foundOrg);
  });

  socket.on("leftChat", () => {
    console.log("🔥: A user left chat page");
    //Updates the list of users when a user disconnects from the server
    let foundOrg = "";
    const allOrgs = Object.keys(chatUsers);
    for (let i = 0; i < allOrgs.length; i++) {
      if (chatUsers[allOrgs[i]].some((user) => user.socketID === socket.id)) {
        foundOrg = allOrgs[i];
      }
    }
    if (foundOrg) {
      chatUsers[foundOrg] = chatUsers[foundOrg].filter(
        (user) => user.socketID !== socket.id
      );
    }
    // console.log(chatUsers);
    //Sends the list of users to the client
    socketIO.to(foundOrg).emit("newUserResponse", chatUsers[foundOrg]);
    socket.leave(foundOrg);
  });
});

// Serve static files
app.use(express.static("build"));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
http.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
