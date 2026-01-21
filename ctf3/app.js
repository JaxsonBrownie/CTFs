const express = require("express");
const { getLocalIP } = require("../util/common");

const app = express();
const PORT = 3333;

// --- Home Page ---
//app.get("/", (req, res) => {
//  res.sendFile("./public/index.html");
//});

app.use(express.static("./ctf3/public"));

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`CTF3 running on http://localhost:${PORT}`);
  console.log('Tell students to connect to:', `http://${getLocalIP()}:${PORT}`);
});