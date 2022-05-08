const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { options } = require("nodemon/lib/config");
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
        app.get('/stock-items', async (req, res) => {
            const query = {};
            const cursor = stockCollection.find(query);
            const stockItems = await cursor.toArray();
            res.send(stockItems);
        })
        app.put("/quantity-update/:id", async (req, res) => {
          const id = req.params.id;
            const updatedQuantity = req.body;
            const filterQuery = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateQuantity = { $set: { quantity: updatedQuantity.quantity } };
          const stockItem = await stockCollection.updateOne(
            filterQuery,
            updateQuantity,
            options
          );
          res.send({ massage: stockItem });
        });
      app.delete('/stock-item-delete/:id', async (req,res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await stockCollection.deleteOne(query);
        res.send(result);
      })
      
        app.get('/stock-item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const stockItem = await stockCollection.findOne(query);
            res.send(stockItem);
            
        })
        app.get('/my-stock/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const cursor = stockCollection.find(query);
            const myStockItems = await cursor.toArray();
            res.send(myStockItems);
            
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

app.get('/', (req, res) => {
  res.send('Running Server');
})

app.listen(port, () => {
  console.log("Server listening on port", port);
});
