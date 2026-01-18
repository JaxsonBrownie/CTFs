const express = require("express");
const path = require("path");
const { getLocalIP } = require("../util/common");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 4444;

app.get("/", (req, res) => {
    res.send(`
        <h1>PhishNet CTF</h1>
        <p>Welcome to the phishing-themed CTF!</p>
        <b>Your goal is to find 5 "flags" (which are just pieces of text). They will look like: FLAG{example-flag}, but with different text inside."

        <ul>
            <li><a href="/km">Knowledge Management Portal (IOCs)</a></li>
            <li><a href="/challenge1">Challenge 1 - Suspicious Email</a></li>
            <li><a href="/challenge2">Challenge 2 - Credential Harvester</a></li>
            <li><a href="/challenge3">Challenge 3 - Malicious Attachment</a></li>
            <li><a href="/challenge4">Challenge 4 - Phishing Site Hunt</a></li>
            <li><a href="/challenge5">Challenge 5 - Legit vs Clone</a></li>
        </ul>
    `);
});

// KM Portal
app.get("/km", (req, res) =>
    res.sendFile(path.join(__dirname, "public/km/index.html"))
);

// Challenges
app.get("/challenge1", (req, res) =>
    res.sendFile(path.join(__dirname, "public/challenge1/index.html"))
);

app.get("/challenge2", (req, res) =>
    res.sendFile(path.join(__dirname, "public/challenge2/index.html"))
);

app.post("/stolen-creds/upload", (req, res) => {
    res.send("<h1>😂 Credentials Stolen! (Don't use real ones)</h1>");
});

app.get("/challenge3", (req, res) =>
    res.sendFile(path.join(__dirname, "public/challenge3/index.html"))
);

app.get("/challenge4", (req, res) => {
    res.send(`
        <h1>Challenge 4 - Phishing Site Hunt</h1>
        <p>One of these sites is a phishing clone using IOC patterns found in KM.</p>
        <ul>
            <li><a href="/challenge4/site1.html">site1</a></li>
            <li><a href="/challenge4/site2.html">site2</a></li>
            <li><a href="/challenge4/site3.html">site3</a></li>
        </ul>
        <a href="/">Back</a>
    `);
});

app.get("/challenge5", (req, res) => {
    res.send(`
        <h1>Challenge 5 - Legit vs Clone</h1>
        <p>Compare JS integrity hashes using the KM portal.</p>
        <p>This challenge involves SHA-256 integrity checks. For more info go to: <a href="https://www.w3schools.com/Tags/att_script_integrity.asp">here</a></p>
        <ul>
            <li><a href="/challenge5/secureA.html">Secure A</a></li>
            <li><a href="/challenge5/secureB.html">Secure B</a></li>
            <li><a href="/challenge5/secureC.html">Secure C</a></li>
            <li><a href="/challenge5/secureD.html">Secure D</a></li>
            <li><a href="/challenge5/secureE.html">Secure E</a></li>
            <li><a href="/challenge5/secureF.html">Secure F</a></li>
        </ul>
        <a href="/">Back</a>
    `);
});

app.listen(PORT, () => {
    console.log(`CTF running on http://localhost:${PORT}`)
    console.log('Tell students to connect to:', `http://${getLocalIP()}:${PORT}`);
});
