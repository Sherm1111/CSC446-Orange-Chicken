const express = require("express");
const mysql = require("mysql2");
const { createHash } = require('crypto');


const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);
const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);
const SQL = "SELECT * FROM users;"


const app = express();
app.use(express.json());


let connection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});


app.use("/", express.static("frontend"));


app.get("/query", function (request, response) {
  connection.query(SQL, [true], (error, results, fields) => {
    if (error) {
      console.error(error.message);
      response.status(500).send("database error");
    } else {
      console.log(results);
      response.send(results);
    }
  });
})

app.post("/login", function (request, response) {
  //recieves the username and password
  var data = request.body;
  //hashes password
  hashpass = createHash('sha256').update(data['password']).digest('hex');
  //makes username something usable for later in code
  user = "'"+data["username"]+"'";
  //query username and passwords from sql database, only if the username is the username input 
  const USERINFO = "SELECT username,password FROM users WHERE username = " + user +";"
  connection.query(USERINFO, [true], (error, results, fields) => {
    if (error) {
      //database error
      console.error(error.message);
      response.status(500).send("database error");
      //if the input password matches input username password from query
    } else if (hashpass == results[0]['password']){
      //send 200 OK
      console.log("200 OK");
      response.status(200).send("OK")
    } else {
      //if username/password are not in database in correct order prevent login
      console.log("UNAUTHORIZED");
      response.status(400).send("UNAUTHORIZED");
    }
  });
})



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
