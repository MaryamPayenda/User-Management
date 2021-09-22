const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// parsing middleware

app.use(bodyParser.urlencoded({ extended: false }));
// parse application json
app.use(bodyParser.json());
// to specify a static folder like folder for photos/custome css file/custome js file
app.use(express.static("public"));

// setup template engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs");

// Creating connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// connecting to the database
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected as ID" + connection.threadId);
});

// requiring the routes from the router file
const routes = require("./server/routes/user");
app.use("/", routes);
app.listen(PORT, () => console.log(`Listeing on port ${PORT}`));
