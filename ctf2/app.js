// import everything
const express = require('express');
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const PORT = 2222;

// load flags from an environment file (you can't see them here!)
dotenv.config();
const FLAG1 = process.env.FLAG1;
const FLAG2 = process.env.FLAG2;
const FLAG3 = process.env.FLAG3;
const FLAG4 = process.env.FLAG4;
const FLAG5 = process.env.FLAG5;
const FLAG5_ENCODED = process.env.FLAG5_ENCODED;

// middleware
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));

// ====================================================================================

// Challenge 1: View Source
/* You will have the view the source code for this challenge! */
app.get('/challenge1', (req, res) => {
  res.send(`
    <h1>Challenge 1</h1>
    <p>Find the flag in the source code.</p>
    <!-- FLAG: ${FLAG1} -->
  `);
});

// ====================================================================================

// Challenge 2: Header-Based Flag
/* You will have to create a custom header to pass
this challenge! Remember, headers are extra metadata for
HTTP requests & responses. You will need to look up how you
can create your own headers. (Hint: Postman can do this). */
app.get('/challenge2', (req, res) => {
  const secretHeader = req.headers['x-ctf-token'];

  if (secretHeader === 'letmein') {
    res.send(`Nice! Here's your flag: ${FLAG2}`);
  } else {
    res.send(`No flag for you. Try sending a special header!
      
      <!--

      Here is the source code:
      
      app.get('/challenge2', (req, res) => {
        const secretHeader = req.headers['x-ctf-token'];

        if (secretHeader === 'letmein') {
          res.send('Nice! Here's your flag: <NOTHERE!>');
        } else {
          res.send('No flag for you. Try sending a special header!');
        }
      });
      
      -->`
    );
  }
});

// ====================================================================================

// Challenge 3: Logic Bypass
/* Carefully look at this code and see where the vulnerability is */
app.get('/challenge3', (req, res) => {
  res.send(`
    <h1>Challenge 3</h1>
    <form method="POST" action="/challenge3">
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/challenge3', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password !== 'admin') {
    res.send(`Logged in as admin! Here's your flag: ${FLAG3}`);
  } else {
    res.send('Invalid credentials');
  }
});

// Challenge 4: Requires special cookie (HARD)
/* You will have to manually create your own cookie. It will
be worth researching what a cookie is (if you don't know)! */
app.get('/challenge4', (req, res) => {
  const cookie = req.headers.cookie || '';
  if (cookie.includes('ctf_access=1')) {
    res.send(`Welcome back, cookie master! Here's your flag: ${FLAG4}`);
  } else {
    res.setHeader('Set-Cookie', 'ctf_access=0');
    res.send(`
      <h1>Challenge 4</h1>
      <p>This challenge has something to do with cookies... 🍪</p>
    `);
  }
});

// ====================================================================================

// Challenge 5: Decoding base64 (HARD)
/* Try to decrypt the given message. (Hint: Look up what base64 is). 
You will need to submit the decrypted message as a URL query parameter.*/
app.get('/challenge5', (req, res) => {
  const { token } = req.query;

  // Base64 encode the flag for the user if no token provided
  if (!token) {
    const encodedFlag = Buffer.from(FLAG5_ENCODED).toString('base64');
    return res.send(`
      <h1>Challenge 5</h1>
      <p>The flag is Base64 encoded and passed as the <code>token</code> query parameter.</p>
      <p>Try decoding this: <code>${encodedFlag}</code></p>
      <p>Submit your decoded flag back as: <code>/challenge5?token=YOUR_ANSWER</code></p>
    `);
  }

  // Check if token matches the flag
  if (token === FLAG5_ENCODED) {
    return res.send(`<h2>Correct! Here's your flag: ${FLAG5}</h2>`);
  } else {
    return res.send('<h2>Incorrect flag, try again!</h2>');
  }
});

// ====================================================================================

// starting point for the challenges
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Backend CTF!</h1>
    <b>Good Luck!</b>
    <ul>
      <li><a href="/challenge1">Challenge 1</a></li>
      <li><a href="/challenge2">Challenge 2</a></li>
      <li><a href="/challenge3">Challenge 3</a></li>
      <li><a href="/challenge4">Challenge 4</a></li>
      <li><a href="/challenge5">Challenge 5</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`CTF2 running on http://localhost:${PORT}`);
});
