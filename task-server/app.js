const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

app.listen(3001, () => {
  console.log("Server Listening on PORT:", 3001);
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

app.get("/tasks/:id", (req, res, next) => {
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
            created INTEGER NOT NULL,\
            desc NVARCHAR(200),\
            due_date INTEGER\
        )",
      (err) => {
        if (err) {
          console.log("Table already exists.");
          db.run("DELETE FROM tasks where user_id = 'test_user'");
        }
        let insert =
          "INSERT INTO tasks (user_id, title, status, created, desc, due_date) VALUES (?,?,?,?,?,?)";
        db.run(insert, [
          "test_user",
          "Pesto challange complete 1",
          "To Do",
          1697907890,
          "NA",
          1697917890,
        ]);
        db.run(insert, [
          "test_user",
          "Pesto challange complete 2",
          "To Do",
          1697907890,
          "NA",
          1697917890,
        ]);
        db.run(insert, [
          "test_user",
          "Pesto challange complete 3",
          "To Do",
          1697907890,
          "NA",
          1697917890,
        ]);
      }
    );
  }
});
