const { Pool } = require("pg");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const emailjs = require("emailjs-com");

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
  const {
    evaluation_name,
    employees_involved,
    description,
    user_id,
    due_date, // Campo adicionado
  } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (
    !evaluation_name ||
    !employees_involved ||
    !description ||
    !user_id ||
    !due_date
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    // Insere a avaliação no banco de dados, incluindo a data prevista
    const result = await pool.query(
      `INSERT INTO evaluations (evaluation_name, employees_involved, description, user_id, scheduled_date) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [evaluation_name, employees_involved, description, user_id, due_date]
    );

    res.status(201).json({
      message: "Avaliação criada com sucesso!",
      evaluation: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao criar avaliação:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota para listar todas as avaliações
app.get("/evaluations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM evaluations ORDER BY created_at DESC;"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Nenhuma avaliação encontrada." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

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

app.get("/idUser", async (req, res) => {
  const { id } = req.query; // Obtém o 'id' dos parâmetros da URL

  if (!id) {
    return res.status(400).json({ message: "O parâmetro 'id' é necessário." });
  }

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Código não encontrado." });
    }

    res.json(result.rows[0]); // Retorna o primeiro resultado encontrado
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.delete("/evaluations/:id", async (req, res) => {
  const { id } = req.params; // Obtém o ID da tarefa a ser deletada

  try {
    const result = await pool.query(
      "DELETE FROM evaluations WHERE id = $1 ", // Deleta e retorna a linha deletada
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Avaliação não encontrada." });
    }

    res.status(200).json({
      message: "Avaliação deletada com sucesso.",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/evaluations/progresso/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE evaluations SET status = $1 WHERE id = $2",
      [status, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Avaliação não encontrada" });
    }

    res.status(200).json({ message: `Alterado para ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

app.get("/emotion-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT emotion_state, COUNT(*) as count
      FROM user_status
      GROUP BY emotion_state
      ORDER BY emotion_state;
    `);

    const emotionCounts = {
      muito_triste: 0,
      triste: 0,
      neutro: 0,
      feliz: 0,
      muito_feliz: 0,
    };

    result.rows.forEach((row) => {
      switch (row.emotion_state) {
        case 1:
          emotionCounts.muito_triste = parseInt(row.count);
          break;
        case 2:
          emotionCounts.triste = parseInt(row.count);
          break;
        case 3:
          emotionCounts.neutro = parseInt(row.count);
          break;
        case 4:
          emotionCounts.feliz = parseInt(row.count);
          break;
        case 5:
          emotionCounts.muito_feliz = parseInt(row.count);
          break;
      }
    });

    res.json(emotionCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
