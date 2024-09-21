import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";

const app = express();
const pool = new Pool({
  user: "sanofi_owner",
  host: "ep-square-hall-a525sdjv.us-east-2.aws.neon.tech",
  database: "sanofi",
  password: "FUDC5KN1fzIL",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log(pool);

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password, employee_code } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, employee_code) VALUES ($1, $2, $3, $4) RETURNING *;",
      [name, email, hashedPassword, employee_code]
    );
    res.status(201).json(result.rows[0]);
    console.log("Cadastro feito");
  } catch (err) {
    console.error(err.message);
    console.log("Erro no cadastro");
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ username: user.name, code: user.employee_code, id: user.id });
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
      "INSERT INTO user_status (employee_code, emotion_state, text_emotion) VALUES ($1, $2, $3) RETURNING *;",
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
      return res.status(404).json({
        message: "Nenhum status encontrado para este código de funcionário.",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/search", async (req, res) => {
  const { searchTerm } = req.body;
  try {
    const query = `
      SELECT u.name, u.email, u.employee_code, us.emotion_state, us.text_emotion, us.created_at
      FROM users u
      LEFT JOIN user_status us ON u.employee_code = us.employee_code
      WHERE u.name ILIKE $1 OR u.email ILIKE $1 OR u.employee_code ILIKE $1
      ORDER BY us.created_at DESC
    `;
    const values = [`%${searchTerm}%`];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/evaluations", async (req, res) => {
  const { evaluation_name, employees_involved, description, user_id } =
    req.body;

  if (!evaluation_name || !employees_involved || !description || !user_id) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO evaluations (evaluation_name, employees_involved, description, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [evaluation_name, employees_involved, description, user_id]
    );

    res.status(201).json({ message: "Avaliação criada com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar avaliação:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota para listar todas as avaliações
app.get("/evaluations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM evaluations ORDER BY created_at DESC;");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nenhuma avaliação encontrada." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});


// Rota para buscar avaliação pelo nome ou ID do criador
app.get("/evaluations/search", async (req, res) => {
  const query = req.query.query; // Recebe o parâmetro de busca

  try {
    const result = await pool.query(
      `SELECT * FROM evaluations 
       WHERE evaluation_name ILIKE $1 OR user_id::text = $1;`,
      [`%${query}%`] // Usando ILIKE para busca case-insensitive
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avaliação não encontrada." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
