require("dotenv").config();
const express = require("express");
const connectDB = require("./database");

connectDB();
const app = express();
const port = 5000;

// JSON parsing middleware
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook server listening on port ${port}`);
});
