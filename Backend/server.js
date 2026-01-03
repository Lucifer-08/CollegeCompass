const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));
app.use(express.json());

connectDB();

app.use("/api/user",require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log("Backend running on PORT 5000"));
