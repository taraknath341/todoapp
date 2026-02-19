"use strict";

// require Module
const { MongoClient } = require("mongodb"),
  express = require("express");
// Mongodb Satup
let db = null;

(async function () {
  const mdb = await MongoClient.connect(process.env.MONGODB_URL);
  console.log("Mongodb Connect Success.");
  db = mdb.db("todo");
})();

// express Satup
const app = express();
app.use(express.json());
app.use(express.static("www"));

app.put("/", async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      res.send("userName is not valid");
      return;
    }
    const collection = db.collection("" + userName.toLowerCase());
    const findRes = await collection.find({}).toArray();
    const resProcess = findRes.map(iv => iv.todoName);
    res.json(resProcess);
  } catch (err) {
    console.log(err.message);
    res.send("Server Error");
  }
})

app.post("/", async (req, res) => {
  try {
    const { todoName, userName } = req.body;
    if (!todoName) {
      res.send("Todo Name is not Valid");
      return;
    }
    if (!userName) {
      res.send("Username is not valid");
      return;
    }
    const collection = db.collection(userName.toLowerCase() + "");
    const findRes = await collection.find({ todoName: todoName }).toArray();
    if (findRes.length !== 0) {
      res.send("This data is already entry");
      return;
    }
    await collection.insertOne({ todoName: todoName });
    res.send(todoName);
  } catch (err) {
    console.log(err.message);
    res.send("Server Error");
  }
})

app.delete("/", async (req, res) => {
  try {
    const { todoName, userName } = req.body;
    if (!todoName) {
      res.send("todoName is not Valid");
      return;
    }
    if (!userName) {
      res.send("userName is not valid");
      return;
    }
    const collection = db.collection(userName.toLowerCase() + "");
    await collection.deleteMany({ todoName: todoName });
    res.send(todoName);
  } catch (err) {
    console.log(err.message);
    res.send("Server Error");
  }
})

app.use((req, res) => {
  res.sendFile(__dirname + "/www/404.html")
})

app.listen(process.env.PORT);
