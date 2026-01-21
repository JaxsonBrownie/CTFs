const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "lab-secret",
    resave: false,
    saveUninitialized: true
  })
);

// ------------------------------
// STATIC CREDENTIAL (INTENTIONALLY WEAK)
// ------------------------------
const WEAK_USERNAME = "admin";
const WEAK_PASSWORD = "password123"; // brute-forceable

// ------------------------------
// STRONG HASHED PASSWORD
// ------------------------------
const STRONG_PASSWORD = "Sup3rStr0ngP@ss!";
const HASHED_PASSWORD = bcrypt.hashSync(STRONG_PASSWORD, 12);

// ------------------------------
// RATE LIMITER FOR HASH LOGIN
// ------------------------------
const hashLoginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // only 5 attempts per minute
  standardHeaders: true,
  legacyHeaders: false
});

// ------------------------------
// STATIC FILES
// ------------------------------
app.use(express.static("public"));

// ------------------------------
// WEAK LOGIN (BRUTE FORCE)
// ------------------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === WEAK_USERNAME && password === WEAK_PASSWORD) {
    req.session.admin = true;
    return res.redirect("/admin.html");
  }

  res.send("Invalid credentials (try again)");
});

// ------------------------------
// STRONG HASH LOGIN (RESISTANT)
// ------------------------------
app.post("/hash-login", hashLoginLimiter, async (req, res) => {
  const { password } = req.body;

  const match = await bcrypt.compare(password, HASHED_PASSWORD);

  if (match) {
    return res.send("✅ Secure admin area unlocked");
  }

  res.send("❌ Invalid password");
});

// ------------------------------
// HASH DISCLOSURE (AFTER LOGIN)
// ------------------------------
app.get("/hash", (req, res) => {
  if (!req.session.admin) {
    return res.status(403).send("Forbidden");
  }

  res.send(`
    <h2>Hashed Password</h2>
    <p>${HASHED_PASSWORD}</p>
    <p>Try cracking this hash on the next login page.</p>
    <a href="/hash-login.html">Go to hash login</a>
  `);
});

// ------------------------------
app.listen(3000, () => {
  console.log("Password lab running on http://localhost:3000");
});
