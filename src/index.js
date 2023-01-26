import { loadApi } from "./api.js";
import { rabitmq } from "./rabitmq.js";
import { worker } from "./worker.js";
import { db } from "./db.js";
import * as dotenv from "dotenv";
dotenv.config();

const queue = process.env.RABITMQ_QUEUE;
const port = process.env.PORT;

const client = db();
const connexion = await rabitmq(queue, client);
await connexion.consume(worker);
loadApi(connexion, client, port);
