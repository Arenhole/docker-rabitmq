import sqlite3 from "sqlite3";

// La fonction db() crée une nouvelle instance de la base de données SQLite
// à partir de la bibliothèque sqlite3 importée.
export function db() {
  // Utilise la méthode Database() pour créer une nouvelle base de données
  // en spécifiant le chemin de la base de données ("./db/db.db")
  const db = new sqlite3.Database("./db/db.db", (err) => {
    // Si une erreur se produit lors de la création de la base de données,
    // affiche un message d'erreur
    if (err) {
      return console.error(err.message);
    }
    // Sinon, affiche un message de connexion réussie
    console.log("Connected to the in-memory SQlite database.");
  });

  // Renvoie l'objet de base de données créé
  return db;
}
