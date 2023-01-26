export async function worker(db, msg) {
  if (msg) {
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
  } else {
    console.log("Consumer cancelled by server");
  }
}
