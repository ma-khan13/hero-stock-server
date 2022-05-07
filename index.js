const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.MONGO_DB_CONNECTION_USER_NAME}:${process.env.MONGO_DB_CONNECTION_USER_PASSWORD}@hero-stock.qxsxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function serverRun() {
    try {
        await client.connect();
        const stockCollection = client.db("heroStock").collection("stock_item")
        app.get('/stock-item', async (req, res) => {
            const query = {};
            const cursor = stockCollection.find(query);
            const stockItems = await cursor.toArray();
            res.send(stockItems);
        })
        app.post('/add-stock-item', async (req, res) => {
            const newStockItem = req.body;
            const result = await stockCollection.insertOne(newStockItem);
            res.send({ massage: "Added Successfully" });
        })

    } finally {
        // await client.close();
    }
}
serverRun().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Server configuration ok");
// });

app.listen(port, () => {
  console.log("Server listening on port", port);
});
