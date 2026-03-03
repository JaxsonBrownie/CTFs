const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

/* -------------------------
   DATABASE SETUP
--------------------------*/
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'supersecret')");
});

/* -------------------------
   STAGE 1 – API KEY IN SOURCE
--------------------------*/

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/secrets", (req, res) => {
  res.sendFile(path.join(__dirname, "views/api-key.html"));
});

app.post("/stage1-aert345h", (req, res) => {
  const { apikey } = req.body;

  if (apikey === "DEV-API-KEY-948372") {
    res.redirect("/stage2-45hft5e");
  } else {
    res.send("Invalid API Key");
  }
});

/* -------------------------
   STAGE 2 – SQL INJECTION
--------------------------*/

app.get("/stage2-45hft5e", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/login-4fhhrft5e", (req, res) => {
  const { username, password } = req.body;

  // INTENTIONALLY VULNERABLE
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    db.get(query, (err, row) => {
    if (row) {
        const token = jwt.sign(
        { username: row.username, role: "user" },
        "temporarysecret",
        { expiresIn: "1h" }
        );

        res.cookie("authToken", token);
        res.redirect("/dashboard-4fhhrft5e");
    } else {
        res.send("Login failed");
    }
    });
});



/* -------------------------
   STAGE 3 – BROKEN ACCESS CONTROL
--------------------------*/

app.get("/dashboard-4fhhrft5e", (req, res) => {
  res.sendFile(path.join(__dirname, "views/dashboard.html"));
});

/* -------------------------
   STAGE 4 – URL FIELD TAMPERING
--------------------------*/

app.get("/profile-arj23hb53", (req, res) => {
  const user = req.query.user;

  if (user === "YWRtaW4=") {
    res.cookie('supersecretrole', false);
    res.sendFile(path.join(__dirname, "views/cookies.html"));
  } else {
    res.send("You have logged in as a normal user profile.");
  }
});

/* -------------------------
   STAGE 5 – INSECURE COOKIE
--------------------------*/

app.get("/cookie-check-asdf345dgh", (req, res) => {
  if (req.cookies.supersecretrole === "true") {
    res.redirect("/x9f7asdlk123final");
  } else {
    res.send("Access denied. Cookie incorrect.");
  }
});

/* -------------------------
   STAGE 6 – JWT TAMPERING
--------------------------*/

app.get("/jwt-admin-panel-afefwwf", (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.send("No token provided.");
  }

  // ❌ VULNERABLE – DOES NOT VERIFY SIGNATURE
  const decoded = jwt.decode(token);

  if (decoded) {
    if (decoded.role === "admin") {
        res.redirect("/x9f7asdlk123final2");
    }
  } else {
    res.send("Access denied. Malformed Token");
  }

  res.send("Access denied");
});

/* -------------------------
   FINAL PAGE
--------------------------*/

app.get("/x9f7asdlk123final", (req, res) => {
  res.sendFile(path.join(__dirname, "views/final.html"));
});

app.get("/x9f7asdlk123final2", (req, res) => {
  res.sendFile(path.join(__dirname, "views/final2.html"));
});

// Hahaha
app.get("/passwords", (req, res) => {
  res.sendFile(path.join(__dirname, "views/cat.html"));
});

app.listen(3000, () => {
  console.log("CTF running on http://localhost:3000");
});

