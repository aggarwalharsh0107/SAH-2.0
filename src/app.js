const express = require('express');
const app = express();
const multer = require("multer");
const session = require("express-session");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

// ===== MongoDB Models =====
const Document = require("../models/document"); // NEW model

// ===== Multer Config =====
const upload = multer({ dest: "uploads/" });

const authRoutes = require('../routes/auth');

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(express.static(path.join(__dirname, "..")));

// ===== View Engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// ===== View Engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..")));

// ===== Routes =====
app.get("/login", (req, res) => {
    res.render('login.ejs');
});

app.get("/register", (req, res) => {
    res.render('register.ejs');
});
// ===============================
// ✅ PDF Upload → Python → MongoDB
// ===============================
app.post("/upload", upload.single("files"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;

        // 🔹 Call Python script
        exec(`python extract.py "${filePath}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error("Python Error:", stderr);
                return res.status(500).json({ error: "Text extraction failed" });
            }

            const extractedText = stdout.trim();

            // 🔹 Save to MongoDB
            const savedDoc = await Document.create({
                filename: req.file.filename,
                originalName: req.file.originalname,
                text: extractedText
            });

            // 🔹 Delete file after processing
            fs.unlink(filePath, () => { });

            res.json({
                success: true,
                document: savedDoc
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/upload", upload.array("files", 10), (req, res) => {
    console.log(req.files); // array of uploaded files
    res.json({ success: true, files: req.files });
});

// ✅ use router
app.use("/", authRoutes);

module.exports = app;