const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const amqplib = require("amqplib/callback_api");
const queue = "command";
let port = 3000;

let conn;

// CONNEXION RABBIMQ
function connect() {
  return new Promise((resolve, reject) => {
    amqplib.connect("amqp://guest:guest@localhost:5672", (err, conn) => {
      if (err) reject(err);
      resolve(conn);
    });
  });
}

// LISTENER RABIMQ
(async () => {
  console.log("Waiting for connection...");

  conn = await connect();
  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      // ON CONSUMME LE MESSAGE
      console.log("Recieved:", msg.content.toString());
      const commande = JSON.parse(msg.content.toString());
      console.log("Mise a jour de la commande ....");
      setTimeout(() => {
        let data = {
          numero: commande.numero,
          flag: "Commande Traitée",
          updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        };
        let sql = `UPDATE Commande set flag = ?, updated_at = ? WHERE numero = ?`;
        let params = [data.flag, data.updated_at, data.numero];
        db.run(sql, params, (err, row) => {
          if (err) {
            console.log("Erreur sur la mise a jour de la commande");
            return;
          } else {
            console.log("Commande mise a jour avec succes");
          }
        });
      }, 5000);
      ch1.ack(msg);
    } else {
      console.log("Consumer cancelled by server");
    }
  });
})();

const db = new sqlite3.Database("./db/db.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

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

app.get("/commande/create", (req, res) => {
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
    const ch2 = await conn.createChannel();
    ch2.sendToQueue(
      queue,
      Buffer.from(`{ "numero": "${numeroCom}", "message": "Creer le plat"}`)
    );

    res.json({
      message: "success",
      result: result,
      data: data,
      id: this.lastID,
    });
  });
});
