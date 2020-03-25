const Joi = require("joi");
const express = require("express");
const app = express();
const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const home = require("./routes/home");
const courses = require("./routes/courses");

app.use("/", home);
app.use("/api/courses", courses);

app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

startupDebugger(`Application name: ${config.get("name")}`);
startupDebugger(`Mail server: ${config.get("mail.host")}`);
startupDebugger(`Mail server PW: ${config.get("mail.password")}`);

app.use(logger);
app.use(auth);

console.log(`app: ${app.get("env")}`);

const port = process.env.NODE_PORT || 3000;

app.listen(3000, () => console.log(`Listening on port ${port}...`));
