import express from "express";
import { v4 as uuidv4 } from "uuid";

export function loadApi(rabitmq, db, port) {
  // DECCLARATION DE L'API ET ROUTES
  const app = express();

  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });

  app.get("/commandes", (req, res) => {
    let sql = "SELECT * FROM Commande";
    let params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });

  app.get("/commande/id/:id", (req, res) => {
    let sql = "SELECT * FROM Commande WHERE id = ?";
    let params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: row,
      });
    });
  });

  app.get("/commande/numero/:numero", (req, res) => {
    let sql = "SELECT * FROM Commande WHERE numero = ?";
    let params = [req.params.numero];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: row,
      });
    });
  });

  app.post("/commande/create", (req, res) => {
    let errors = [];
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    let numeroCom = uuidv4();
    let data = {
      numero: numeroCom,
      flag: "Commande en attente de traitement",
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    let sql =
      "INSERT INTO Commande (numero, flag, created_at, updated_at) VALUES (?,?,?,?)";
    let params = [data.numero, data.flag, data.created_at, data.updated_at];
    db.run(sql, params, async function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      // CREATION MESSAGE POUR TRAITER LA COMMANDE
      rabitmq.send(`{ "numero": "${numeroCom}", "message": "Creer le plat"}`);

      res.json({
        message: "success",
        result: result,
        data: data,
        id: this.lastID,
      });
    });
  });
}
