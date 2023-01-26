import { loadApi } from "./api.js";
import { rabitmq } from "./worker.js";
import { db } from "./db.js";
const queue = "command";

const client = db();
const connexion = await rabitmq(client, queue);
loadApi(connexion, client, queue);
