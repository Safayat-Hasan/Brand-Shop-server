const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nyvh0ei.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productsDB').collection('products');
    const cartCollection = client.db('productsDB').collection('cart');


    // products

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.get('/products/details/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = {
        brand: brand
      }
      const result = await productCollection.find(query).toArray();
      return res.send(result);
    }) 

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name, image: updatedProduct.image, brand: updatedProduct.brand, type: updatedProduct.type, price: updatedProduct.price, rating: updatedProduct.rating
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })

    // cart

    app.post('/cart', async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send("Brand-shop server running")
})

app.listen(port, () => {
  console.log(`Brand-shop server running on port: ${port}`)
})