require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");

connectDB();
const app = express();
const port = 5000;

// Adding middleware
app.use(cors());
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook server listening on port ${port}`);
});
