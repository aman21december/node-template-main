const express = require("express");
const app = express();

const { general } = require("./general");
const { auth } = require("./auth");
const {item} = require("./item");
app.use("/auth", auth);
app.use("/item", item)
// /v1/auth/signup
// /v1/auth/login
// /v1/item
module.exports = app;
