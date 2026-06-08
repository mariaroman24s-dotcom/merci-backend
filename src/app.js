const express = require("express");
const cors = require("cors");

const routes = require("./routes/index.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "MERCI AI Platform API funcionando",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;