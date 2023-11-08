const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = new sqlite3.Database("players.db");

app.post("/register", (req, res) => {
  const { username, password } = req.body;


  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error("Помилка при перевірці логіну:", err);
      res.status(500).json({ error: "Помилка сервера" });
      return;
    }

    if (row) {

      res.status(409).json({ error: "Такий логін вже існує" });
    } else {

      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
        if (err) {
          console.error("Помилка при реєстрації:", err);
          res.status(500).json({ error: "Помилка сервера" });
        } else {
          res.status(200).json({ message: "Реєстрація успішна" });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});

import React, { Component } from "react";
import axios from "axios";

class RegistrationForm extends Component {
  state = {
    username: "",
  };

  handleRegistration = () => {
    const { username } = this.state;

    axios.post("http://localhost:3000/register", { username })
      .then(response => {
        console.log(response.data.message);

      })
      .catch(error => {
        console.error("Помилка під час реєстрації:", error);

      });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Логін"
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <button onClick={this.handleRegistration}>Зареєструватися</button>
      </div>
    );
  }
}

export default RegistrationForm;