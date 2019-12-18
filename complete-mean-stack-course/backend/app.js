const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const authRoutes = require('./routes/user');

const app = express();

const MONGO_USER = 'user';
const MONGO_PWD = 'Yf4C3AFAhDP8WFsD';
const MONGO_DATABASE = 'mean-stack';
const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@cluster0-l2fui.mongodb.net/${MONGO_DATABASE}`;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", authRoutes);

module.exports = app;
