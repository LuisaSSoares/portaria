const express = require("express");
const app = express();
const port = 3020;
const db = require("./db_config");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Cadastro de Morador
app.post("/user/cadastrar", (req, res) => {
  const { nome, bloco, apto, telefone, email, status } = req.body; 
  const sql = `INSERT INTO moradores (nome, bloco, apartamento, telefone, email, status) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nome, bloco, apto, telefone, email, status], (err, result) => {
      if (err) {
          console.log(err);
          res.json({ success: false, message: "Erro ao cadastrar usuário." });
      } else {
          const novoId = result.insertId; // pega o id do morador cadastrado
          res.json({ success: true, message: "Usuário cadastrado com sucesso.", moradorId: novoId });
      }
  });
});


// Cadastro de Veículo
app.post("/carro/cadastrar", (req, res) => {
  const { placa, modelo, cor, box, morador_id } = req.body;
  const sql = `INSERT INTO veiculos (placa, modelo, cor, box, morador_id) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [placa, modelo, cor, box, morador_id], (err, result) => {
      if (err) {
          console.error("Erro no banco de dados:", err);
          res.json({ success: false, message: "Erro ao cadastrar veículo. Placa ou vaga já pertencentes a outro usuário. Tente novamente" });
      } else {
          console.log("Veículo cadastrado com sucesso!");
          res.json({ success: true, message: "Veículo cadastrado com sucesso." });
      }
  });
});

// Listar moradores e veículos
app.get("/listar", (req, res) => {
    const sql = `
        SELECT m.id, m.nome, m.bloco, m.apartamento, m.telefone, m.email, 
               v.placa, v.modelo, v.cor, v.box 
        FROM moradores m 
        LEFT JOIN veiculos v ON m.id = v.morador_id`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.json({ success: false, message: "Erro ao buscar dados." });
        } else {
            res.json(results);
        }
    });
});

// Atualizar morador e veículo
app.put("/atualizar/:id", (req, res) => {
    const { id } = req.params;
    const { nome, bloco, apartamento, telefone, email, placa, modelo, cor, box } = req.body;

    const sqlMorador = "UPDATE moradores SET nome=?, bloco=?, apartamento=?, telefone=?, email=? WHERE id=?";
    const sqlVeiculo = "UPDATE veiculos SET placa=?, modelo=?, cor=?, box=? WHERE morador_id=?";

    db.query(sqlMorador, [nome, bloco, apartamento, telefone, email, id], err => {
        if (err) return res.json({ success: false, message: "Erro ao atualizar morador." });

        db.query(sqlVeiculo, [placa, modelo, cor, box, id], err => {
            if (err) return res.json({ success: false, message: "Erro ao atualizar veículo." });

            res.json({ success: true, message: "Atualização feita com sucesso!" });
        });
    });
});

// Deletar morador e veículo
app.delete("/deletar/:id", (req, res) => {
    const { id } = req.params;
    
    const sqlVeiculo = "DELETE FROM veiculos WHERE morador_id=?";
    const sqlMorador = "DELETE FROM moradores WHERE id=?";

    db.query(sqlVeiculo, [id], err => {
        if (err) return res.json({ success: false, message: "Erro ao deletar veículo." });

        db.query(sqlMorador, [id], err => {
            if (err) return res.json({ success: false, message: "Erro ao deletar morador." });

            res.json({ success: true, message: "Morador e veículo deletados!" });
        });
    });
});


app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
