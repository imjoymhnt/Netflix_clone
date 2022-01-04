const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./route/users");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connected`);
  })
  .catch((err) => console.log(err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ success: true, msg: "Alive" });
});

app.use("/", authRoute);

app.listen(4000, () => console.log(`Backend is running`));
