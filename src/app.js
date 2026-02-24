const express = require('express');
const app = express();
const multer = require("multer");
const session = require("express-session");
const path = require("path");
<<<<<<< HEAD
const { exec } = require("child_process");
const fs = require("fs");

// ===== MongoDB Models =====
const Document = require("../models/Document"); // NEW model

// ===== Multer Config =====
const upload = multer({ dest: "uploads/" });

const authRoutes = require('../routes/auth');
=======

const upload = multer({ dest: "uploads/" });

const authRoutes = require('../routes/auth'); 
>>>>>>> 93338859cdb177e485cfbbc1316a429cfd631e4b

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, "..")));

// ===== View Engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
=======
// ===== View Engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..")));
>>>>>>> 93338859cdb177e485cfbbc1316a429cfd631e4b

// ===== Routes =====
app.get("/login", (req, res) => {
    res.render('login.ejs');
});

app.get("/register", (req, res) => {
    res.render('register.ejs');
});

<<<<<<< HEAD
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

// ===== Auth Routes =====
app.use("/auth", require("../routes/auth"));
=======
app.post("/upload", upload.single("files"), (req, res) => {
    res.json({ success: true });
});

// ✅ use router
>>>>>>> 93338859cdb177e485cfbbc1316a429cfd631e4b
app.use("/", authRoutes);

module.exports = app;