// routes/auth.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/users");

const upload = multer({ dest: "uploads/" });

// ================= SHOW PAGES =================

// Login page
router.get("/login", (req, res) => {
    res.render("login");
});

// Register page
router.get("/register", (req, res) => {
    res.render("register");
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.redirect("/login"); // redirect after registration
    } catch (err) {
        console.error(err);
        res.send("Error saving user");
    }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.send("Invalid email or password ❌");
        }

        // TODO: add session handling here
        res.redirect("/?login=success");

    } catch (err) {
        console.error(err);
        res.send("Login error");
    }
});

// ================= LOGOUT =================
router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                return res.send("Error logging out");
            }
            return res.redirect("/login?logout=success");
        });
    } else {
        res.redirect("/login");
    }
});

// ================= EXTRA ROUTES =================
router.get("/home", (req, res) => {
    res.redirect("/index.html");
});

module.exports = router;