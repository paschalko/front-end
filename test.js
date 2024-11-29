const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");

// Initialize express app
const app = express();

// Middleware
app.use(morgan("short"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB URI and Client Setup
const uri = "mongodb+srv://ibeanukosi:paschal@cluster0.ye24p.mongodb.net/";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Database variable
let database;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        database = client.db("webstore"); // Replace with your database name
        startServer(); // Start server only after database is connected
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to our lesson store");
});

// Fetch lessons from MongoDB
app.get("/api/lessons", async (req, res) => {
    try {
        const lessonsCollection = database.collection("lessons");
        const lessons = await lessonsCollection.find({}).toArray();
        res.status(200).json(lessons);
    } catch (error) {
        console.error("Error fetching lessons:", error.message);
        res.status(500).json({ error: "Unable to fetch lessons" });
    }
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("Resource not found!");
});

// Function to start the server
function startServer() {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`App has started on port ${PORT}`);
    });
}

// Start the database connection
connectToDatabase();
