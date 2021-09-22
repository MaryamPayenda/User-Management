const mysql = require("mysql");

// creating pool of connection
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    //   use the connection to make the query
    connection.query(
      "select * from User where status='active'",
      (err, rows) => {
        // when the connection succed then release the connection
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log("The data from table : \n", rows);
      }
    );
  });
};

// find user by first_name and last_name
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    let searchTerm = req.body.search;

    //   use the connection to make the query
    connection.query(
      "select * from User where first_name like ? OR last_name like?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        // when the connection succed then release the connection
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from table : \n", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

// add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    let searchTerm = req.body.search;
    connection.query(
      "insert into User set first_name = ?, last_name = ?,email=?,phone=?,comments=?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.render("add-user", { alert: "User added successfully." });
        } else {
          console.log(err);
        }
        console.log("The data from table : \n", rows);
      }
    );
  });
};

// Get the data from the main table in to the edit user

exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query(
      "select * from User where id= ?",
      [req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from table : \n", rows);
      }
    );
  });
};

// Update the data in the edit user

exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query(
      "Update User set first_name=? , last_name=? , email=? ,phone=?,comments=? where id=?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log("Connected as ID" + connection.threadId);

            connection.query(
              "select * from User where id= ?",
              [req.params.id],
              (err, rows) => {
                connection.release();

                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} has been updated!`,
                  });
                } else {
                  console.log(err);
                }
                console.log("The data from table : \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("The data from table : \n", rows);
      }
    );
  });
};

// deleting by id and it will delete the complete log from database as well to not delete it from database jsut delete it from our list

exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query(
      "UPDATE User SET status = ? WHERE id = ?",
      ["removed", req.params.id],
      (err, rows) => {
        if (!err) {
          let removedUser = encodeURIComponent("User successeflly removed.");
          res.redirect("/?removed=" + removedUser);
        } else {
          console.log(err);
        }
        console.log("The data from beer table are: \n", rows);
      }
    );
  });
};

// view all
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);

    //   use the connection to make the query
    connection.query(
      "select * from User where id =?",
      [req.params.id],
      (err, rows) => {
        // when the connection succed then release the connection
        connection.release();

        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from table : \n", rows);
      }
    );
  });
};
