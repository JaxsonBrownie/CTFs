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

/*
hydra for brute forcing login page


john --format=bcrypt hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
*/

// ------------------------------
// STATIC CREDENTIAL (INTENTIONALLY WEAK)
// ------------------------------
const WEAK_USERNAME = "admin";
const WEAK_PASSWORD = "bella2008"; // brute-forceable

// ------------------------------// ------------------------------
// BASE64 "ENCODED" PASSWORD (NOT SECURITY)
// ------------------------------
const BASE64_PASSWORD_PLAINTEXT = "thisIsBase64EncodedText!";
const BASE64_ENCODED = Buffer
  .from(BASE64_PASSWORD_PLAINTEXT)
  .toString("base64");

// STRONG HASHED PASSWORD
// ------------------------------
const STRONG_PASSWORD = "10301985";
const HASHED_PASSWORD = bcrypt.hashSync(STRONG_PASSWORD, 12);

// ------------------------------
// RATE LIMITER FOR HASH LOGIN
// ------------------------------
const hashLoginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // only 5 attempts per minute
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
    return res.send(`
      Secure admin area unlocked.
      <p>Try to decrypt this to get access to the next area: ${BASE64_ENCODED}</p>
      <a href="/base64-login.html">Go to base64 login</a>
    `);
  }

  res.send("Invalid password");
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

app.post("/base64-login", (req, res) => {
  const { password } = req.body;

  const decoded = Buffer
    .from(BASE64_ENCODED, "base64")
    .toString("utf8");

  if (password === decoded) {
    return res.send("Logged in using Base64-decoded password. CTF{password-cracking-hard}");
  }

  res.send("Invalid password");
});


// ------------------------------
// BASE64 DISCLOSURE (AFTER LOGIN)
// ------------------------------
app.get("/base64", (req, res) => {
  if (!req.session.admin) {
    return res.status(403).send("Forbidden");
  }

  res.send(`
    <h2>Base64 Encoded Password</h2>

    <p>${BASE64_ENCODED}</p>

    <p>
      This is NOT encryption or hashing.<br>
      It is simple encoding.
    </p>

    <a href="/base64-login.html">Proceed to Base64 login</a>
  `);
});


// ------------------------------
app.listen(3000, () => {
  console.log("Password lab running on http://localhost:3000");
});
