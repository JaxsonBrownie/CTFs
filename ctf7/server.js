const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

const SECRET = "secret123"; // weak secret intentionally
const FLAG = fs.readFileSync("./flag.txt").toString().trim();

const USERS = {
    player: {
        password: "player",
        role: "user"
    }
};

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!USERS[username] || USERS[username].password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        {
            username: username,
            role: USERS[username].role
        },
        SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: false
    });

    res.json({ message: "Logged in" });
});

function auth(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}

app.get("/profile", auth, (req, res) => {

    res.json({
        username: req.user.username,
        role: req.user.role
    });

});

app.get("/admin", auth, (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admins only" });
    }

    res.json({ flag: FLAG });

});

app.listen(7777, () => {
    console.log("CTF running on http://localhost:7777");
});