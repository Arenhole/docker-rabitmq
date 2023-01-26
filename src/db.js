import sqlite3 from "sqlite3";
export function db() {
  const db = new sqlite3.Database("./db/db.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memsory SQlite database.");
  });

  return db;
}
