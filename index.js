const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000;
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;



const { response } = require('express');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txt18.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
  res.send('Hello World! I AM WORKING')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const productCollection = client.db("shopappdb").collection("products");
  const orderCollection = client.db("shopappdb").collection("orders");

  app.get('/products', (req, res) => {
      productCollection.find()
      .toArray((err, items) => {
          res.send(items)
      })
  })

  app.post('/addproduct', (req, res) => {

      const newProduct = req.body;

      productCollection.insertOne(newProduct)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/orderedproducts', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/getorders', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  

  app.delete('/deleteproduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.findOneAndDelete({_id: id})
    .then(documents => {res.send(!!documents.value)})
  })
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})