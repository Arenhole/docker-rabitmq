import * as amqplib from "amqplib";

export async function rabitmq(queue, db) {
  const conn = await amqplib.connect(
    "amqp://guest:guest@localhost:5672",
    (err, conn) => {
      if (err) return reject(err);
      resolve(conn);
    }
  );

  console.log("Waiting for connection...");

  async function consume(functionToConsume) {
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);

    ch1.consume(queue, (msg) => {
      functionToConsume(db, msg);
      ch1.ack(msg);
    });
  }

  async function send(json) {
    const ch2 = await conn.createChannel();
    ch2.sendToQueue(queue, Buffer.from(json));
  }

  return {
    conn: conn,
    consume: consume,
    send: send,
  };
}
