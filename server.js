const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const authorizedUsers = { "admin": "password123" };
function auth(req, res, next) {
  const user = req.headers["username"];
  const pass = req.headers["password"];
  if (authorizedUsers[user] === pass) next();
  else res.status(401).send("Unauthorized");
}

app.post("/verify", auth, (req, res) => {
  const { serial } = req.body;
  res.json({ valid: serial === "ABC123" });
});

app.post("/relay", auth, async (req, res) => {
  try {
    const { url, method, body } = req.body;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));