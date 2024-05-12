// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 5000;
// require("dotenv").config();

// //middleware
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Blog Hub Server Running");
// });

// app.listen(port, () => {
//   console.log(`Blog Hub Server Running in ${port}`);
// });

// //mongodb

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ubfbj4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();

//     const blogCollection = client.db("blogDB").collection("blog");

//     app.post("/blogs", async (req, res) => {
//       const newBlog = req.body;
//       console.log(newBlog);
//       const result = await blogCollection.insertOne(newBlog);
//       // res.send(result);
//     });
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ubfbj4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Set up routes after successful connection
    const blogCollection = client.db("blogDB").collection("blog");

    // Route to handle blog creation
    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    // Start Express server
    app.listen(port, () => {
      console.log(`Blog Hub Server Running in ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

startServer();
