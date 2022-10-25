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

let chatUsers = [];

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route includes
const userRouter = require("./routes/user.router");
const orgRouter = require("./routes/organization.router");
const messageRouter = require("./routes/messages.router");
const { query } = require("express");

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
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    chatUsers.push(data);
    // console.log(chatUsers);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", chatUsers);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    chatUsers = chatUsers.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", chatUsers);
    socket.disconnect();
  });

  socket.on("leftChat", () => {
    console.log("🔥: A user left chat page");
    //Updates the list of users when a user disconnects from the server
    chatUsers = chatUsers.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", chatUsers);
    socket.disconnect();
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
