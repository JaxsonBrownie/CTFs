const express = require("express");
const bodyParser = require("body-parser");
const { getLocalIP } = require("../util/common");

const app = express();
const PORT = 1111;

app.use(bodyParser.urlencoded({ extended: false }));

// --- Fake database (bad practice: passwords stored in plaintext) ---
let users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "password", role: "user" }
];

// --- Home Page ---
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Workshop App</h1>
    <form method="POST" action="/login">
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" type="password" />
      <button type="submit">Login</button>
    </form>

    <p>Your goal is to find the flag in this website. It will look something like: CTF{this-is-an-example-flag}.

    <!--
        test account rem in prod:
        username: user
        password: password
    -->
  `);
});

// --- Login Route (Cryptographic Failure: plaintext check) ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // BAD: plaintext password check
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // BAD: store role in query parameter instead of session/token
    res.redirect(`/dashboard?user=${username}&role=${user.role}`);
  } else {
    res.send("Invalid credentials!");
  }
});

// --- Dashboard (Broken Access Control) ---
app.get("/dashboard", (req, res) => {
  const { user, role } = req.query;

  // BAD: Trusting client-controlled query params
  if (role === "admin") {
    res.send(`
      <h1>Admin Dashboard</h1>
      <p>Welcome ${user}, you have admin access!</p>
      <a href="/secret-config">View server config</a>
    `);
  } else {
    res.send(`<h1>User Dashboard</h1><p>Welcome ${user}!</p>
        <h2>Try manipulating your role in the URL parameter to be admin</h2>`);
  }
});

// --- Security Misconfiguration: Exposing sensitive files ---
app.use("/public", express.static("public")); // BAD: may leak .env, backups

// --- Security Misconfiguration: Debug endpoint ---
app.get("/secret-config", (req, res) => {
  res.send(`
    <h2>Server Config</h2>
    <pre>
    DB_PASSWORD=supersecret
    API_KEY=12345-ABCDE
    NODE_ENV=development
    FLAG=CTF{you-have-finished}
    </pre>
  `);
});

// --- Error Handling (Misconfiguration: showing stack trace in prod) ---
app.get("/error", (req, res) => {
  throw new Error("This is a crash!");
});

app.use((err, req, res, next) => {
  res.status(500).send(`<h3>Server Error:</h3><pre>${err.stack}</pre>`);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`CTF1 running on http://localhost:${PORT}`);
  console.log('Tell students to connect to:', `http://${getLocalIP()}:${PORT}`);
});
