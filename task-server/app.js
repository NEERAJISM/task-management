const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "0ef602a676dd486281b78fb3b3bf1c4e";

const users = [
  {
    id: 1,
    username: "test_user",
    password: "$2b$10$o3ZIOJRgfmIvaK.5SVGxruOVIBO9L2z5YEdfPNyCPOmRm0jFPOq4G", // password123
  },
  // Add more users if needed
];

app.listen(3001, () => {
  console.log("Server Listening on PORT:", 3001);
});

app.get("/api/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  res.status(200).json({ token });
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Token is not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    req.user = user;
    next();
  });
}

app.get("/api/fetch/:id", verifyToken, (req, res, next) => {
  var params = [req.params.id];
  db.all(
    `SELECT * FROM tasks where user_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json(rows);
    }
  );
});

app.delete("/api/delete/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM tasks WHERE task_id = ?";

  db.run(sql, id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Record deleted successfully" });
  });
});

app.post("/api/new", verifyToken, (req, res) => {
  const { userid, title, status, desc, duedate } = req.body;
  const due_date = new Date(duedate);

  db.run(
    "INSERT INTO tasks (user_id, title, status, desc, due_date) VALUES (?, ?, ?, ?, ?)",
    [userid, title, status, desc, due_date],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Task added successfully" });
    }
  );
});

const db = new sqlite3.Database("./task_database.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    db.run(
      "CREATE TABLE tasks ( \
            task_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            user_id INTEGER NOT NULL,\
            title NVARCHAR(50)  NOT NULL,\
            status NVARCHAR(10)  NOT NULL,\
            created DATETIME DEFAULT CURRENT_TIMESTAMP,\
            desc NVARCHAR(200),\
            due_date DATETIME\
        )",
      (err) => {
        if (err) {
          console.log("Table already exists.");
        }
      }
    );
  }
});
