const { Pool } = require("pg");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const app = express();
const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "sanofi",
  password: "password",
  port: 5432,
});
console.log(pool);

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password, employee_code } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, employee_code) VALUES ($1, $2, $3, $4);",
      [name, email, hashedPassword, employee_code]
    );
    res.status(201).json(result.rows[0]);
    console.log("cadastro feito");
  } catch (err) {
    console.error(err.mensage);
    console.log("erro cadastro");
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ username: user.name, code: user.employee_code});
    res.status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/user-status", async (req, res) => {
  const { employee_code, emotion_state, text_emotion } = req.body;

  if (!text_emotion || !employee_code || !emotion_state) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  if (emotion_state < 1 || emotion_state > 5) {
    return res
      .status(400)
      .json({ message: "O estado emocional deve estar entre 1 e 5." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO user_status (employee_code, emotion_state, text_emotion) VALUES ($1, $2, $3);",
      [employee_code, emotion_state, text_emotion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/user-status/:employee_code", async (req, res) => {
  const { employee_code } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM user_status WHERE employee_code = $1 ORDER BY created_at DESC LIMIT 1;",
      [employee_code]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({
          message: "Nenhum status encontrado para este código de funcionário.",
        });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
