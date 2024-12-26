const express = require("express");
const { MongoClient, Collection } = require("mongodb");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
console.log(process.env.MONGO_URI);
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "PassPal";

client.connect();

// get all the passwords
app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

// Save a password
app.post("/", async (req, res) => {
  const password = req.body;

  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.insertOne(password);
  res.json({ success: true, result: findResult });
});

// delete a password
app.delete("/", async (req, res) => {
  const password = req.body;

  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.deleteOne(password);
  res.json({ success: true, result: findResult });
});
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
