const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");

require("dotenv").config();
require("./helpers/init_mongodb");

const userRoutes = require("./Routes/user.routes");
const contactRoutes = require("./Routes/contact.routes");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(contactRoutes);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: { status: err.status || 500, message: err.message } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
