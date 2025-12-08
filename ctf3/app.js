const express = require("express");

const app = express();
const PORT = 3333;

// --- Home Page ---
//dapp.get("/", (req, res) => {
//  res.sendFile("index.html");
//});

app.use(express.static("public"));

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`CTF3 running on http://localhost:${PORT}`);
});