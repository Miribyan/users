import express from "express";
import mysql from "mysql2";
import crypto from "crypto";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import MySQLStore from "connect-mysql";
import { connect } from "http2";
import bcrypt from "bcrypt";
import path from "path";

require("dotenv").config();

const MySQLSessionStore = MySQLStore(session);

const app = express();
const router = express.Router();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: REACT_APP_FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MySQLSessionStore({
      config: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    }),
  })
);
app.use("/", router);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
app.use(express.static(path.join(__dirname, "client/build")));

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function verify(email, password, callback) {
      console.log(email, password);
      query(`SELECT * FROM users WHERE email = '${email}'`, ([row]) => {
        if (!row) {
          return callback(null, false, {
            message: "Incorrect email or password.",
          });
        }

        bcrypt.compare(password, row.password, function (err, result) {
          if (err) {
            return callback(err);
          } else if (result) {
            console.log("Sucess callback");
            return callback(null, row);
          } else {
            return callback(null, false, {
              message: "Incorrect email or password.",
            });
          }
        });
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

function createConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    insecureAuth: true,
  });
}

const query = (sql, callback) => {
  const connection = createConnection();
  connection.connect();
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    callback(rows);
    connection.end();
  });
};

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

router.get("/userinfo", passport.authenticate("session"), (req, res) => {
  if (req.user) {
    query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = "${req.user.email}"`,
      (result) => {
        if (result) {
          console.log(result);
        }
      }
    );
    res.status(200);
    res.send(req.user);
  } else {
    res.status(404).send();
  }
});

router.get("/users", passport.authenticate("session"), (req, res) => {
  if (req.isAuthenticated()) {
    query("SELECT * FROM users", (users) => {
      res.json(users);
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  query(`SELECT * FROM users WHERE email = "${email}"`, (user) => {
    if (user.length > 0 && user[0].isBlocked === 0) {
      passport.authenticate("local", {
        successRedirect: `${process.env.REACT_APP_FRONTEND_URL}/users`,
        failureRedirect: `${process.env.REACT_APP_FRONTEND_URL}?failure=true`,
      })(req, res);
    } else if (user.length > 0 && user[0].isBlocked === 1) {
      res.status(402).redirect(`${process.env.REACT_APP_FRONTEND_URL}?blocked`);
    } else {
      res
        .status(404)
        .redirect(`${process.env.REACT_APP_FRONTEND_URL}?not_found`);
    }
  });
});

router.post("/reginfo", async (req, res) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const email = req.body.email;

  if (!name || !lastname || !email || !req.body.password) {
    res.status(408).send("Fields can't be empty");
    return;
  }

  const password = bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) {
      console.log(err);
    } else {
      query(`SELECT * FROM users WHERE email = "${email}";`, (result) => {
        if (result.length > 0 && result[0].isBlocked == 0) {
          res.status(409).send("User is already exist");
          return;
        } else if (result.length > 0 && result[0].isBlocked == 1) {
          res.status(410).send("User have been blocked");
          return;
        } else {
          query(
            `INSERT INTO users (name, lastname, email, password) VALUES ("${name}", "${lastname}", "${email}", "${hash}")`,
            (result) => {
              if (result) {
                res.status(200).send("Registered successfully");
                return;
              }
            }
          );
        }
      });
    }
  });
  console.log(password);
});

router.post("/block", (req, res) => {
  const id_list = req.body.join(",");
  console.log(req.body.join(","));
  try {
    const result = query(
      `UPDATE users SET isBlocked='1' WHERE id IN (${id_list})`,
      (stat) => {
        console.log(stat);
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

router.post("/unblock", async (req, res) => {
  const id_list = req.body.join(",");
  console.log(req.body.join(","));
  try {
    const result = query(
      `UPDATE users SET isBlocked='0' WHERE id IN (${id_list})`,
      (stat) => {
        console.log(stat);
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

router.delete("/delete", (req, res) => {
  const id_list = req.body.join(",");
  try {
    const result = query(
      `DELETE FROM users WHERE id IN (${id_list})`,
      (stat) => {
        console.log(stat);
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

app.post("/logout", (req, res) => {
  req.logout(() => {
    res
      .clearCookie("connect.sid", {
        domain: `${process.env.REACT_APP_FRONTEND_URL}`,
        path: "/",
      })
      .redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}…`));
