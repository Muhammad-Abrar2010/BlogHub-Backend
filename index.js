// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection URI
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ubfbj4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Connect to MongoDB
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function startServer() {
//   try {
//     // Connect to MongoDB
//     await client.connect();
//     console.log("Connected to MongoDB");

//     // Set up routes after successful connection
//     const blogCollection = client.db("blogDB").collection("blog");
//     const wishlistCollection = client.db("blogDB").collection("wishlist");

//     // Route to handle blog creation
//     app.post("/blogs", async (req, res) => {
//       const newBlog = req.body;
//       console.log(newBlog);
//       const result = await blogCollection.insertOne(newBlog);
//       res.send(result);
//     });

//     app.get("/blogs", async (req, res) => {
//       const cursor = blogCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/blog/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await blogCollection.findOne(query);
//       res.send(result);
//     });

//     app.post("/wishlist", async (req, res) => {
//       const { userName, userEmail, blogId } = req.body;
//       const wishlistItem = { userName, userEmail, blogId };
//       const result = await wishlistCollection.insertOne(wishlistItem);
//       res.send(result);
//     });

//     app.get("/wishlist", async (req, res) => {
//       const { userEmail } = req.query;
//       const query = { userEmail };
//       const result = await wishlistCollection.find(query).toArray();
//       res.send(result);
//     });

//     app.delete("/wishlist/:id", async (req, res) => {
//       const { id } = req.params;
//       const { userEmail } = req.body;

//       const query = { _id: new ObjectId(id), userEmail };

//       const result = await wishlistCollection.deleteOne(query);

//       res.send(result);
//     });


//     // Start Express server
//     app.listen(port, () => {
//       console.log(`Blog Hub Server Running in ${port}`);
//     });
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//   }
// }

// startServer();


const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const wishlistCollection = client.db("blogDB").collection("wishlist");

    app.post("/blogs", async (req, res) => {
      try {
        const newBlog = req.body;
        const result = await blogCollection.insertOne(newBlog);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to create blog" });
      }
    });

    app.get("/blogs", async (req, res) => {
      try {
        const result = await blogCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to retrieve blogs" });
      }
    });

    app.get("/blog/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await blogCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to retrieve blog" });
      }
    });

    app.post("/wishlist", async (req, res) => {
      try {
        const { userName, userEmail, blogId } = req.body;
        const wishlistItem = { userName, userEmail, blogId };
        const result = await wishlistCollection.insertOne(wishlistItem);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to add to wishlist" });
      }
    });

    app.get("/wishlist", async (req, res) => {
      try {
        const { userEmail } = req.query;
        const result = await wishlistCollection.find({ userEmail }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to retrieve wishlist" });
      }
    });

    app.delete("/wishlist/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { userEmail } = req.body;

        const query = { _id: new ObjectId(id), userEmail };
        const result = await wishlistCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to remove from wishlist" });
      }
    });

    // Start Express server
    app.listen(port, () => {
      console.log(`Blog Hub Server Running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

startServer();
