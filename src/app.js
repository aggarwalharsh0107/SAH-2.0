const express = require('express');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });



module.exports = app;

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/upload", upload.single("files"), (req, res) => {
    res.json({ success: true });
});