const express = require("express");
const mysql = require("mysql2");
const { createHash } = require('crypto');
const jwt = require('jsonwebtoken');
const bc = require('bcrypt');

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


app.post("/query", async (request, response) => {
  //get the jwt
  var data = request.body;
  //verify
  try{
    jwt.verify(data[1],'secret')
    console.log(jwt.verify(data[1],'secret'))
    connection.query(SQL, [true], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        response.status(500).send("database error");
      } else {
        //console.log(results);
        response.send(results);
      }
    });
  }catch{
    response.send("401")
  }
})

app.post("/login", async (request, response) => {
  //recieves the username and password
  var data = request.body;
  //salt
  const salt = await bc.genSalt();
  // hashes password gotten from user
  const hashpass = createHash('sha256').update(data['password']).digest('hex');
  //hashes password again using bcrypt
  const hashpass1 = await bc.hash(hashpass, salt);
  //makes username something usable for later in code
  user = "'"+data["username"]+"'";
  //query username and passwords from sql database, only if the username is the username input 
  const USERINFO = "SELECT username,password,role FROM users WHERE username = " + user +";"
  connection.query(USERINFO, [true], async (error, results, fields) => {
    try{
      if (error) {
        //database error
        console.error(error.message);
        response.status(500).send("database error");
        //if the input password matches input username password from query
      } else if (data['password'] == ''){
        //  if password is blank
        response.status(400).send("UNAUTHORIZED");
        //compares hashed password in database with hashed and salted password given from user.
      } else if (await bc.compare(results[0]['password'], hashpass1)){
        //create token
        var token = jwt.sign(results[0], "secret", {expiresIn:"30s"})
        //send 200 OK
        console.log("200 OK")
        //send token to common.js
        response.send(token)
        
      } else {
        //if username/password are not in database in correct order prevent login
        response.status(400).send("UNAUTHORIZED");
      }
    } catch (error){
      console.log("UNAUTHORIZED");
      response.status(400).send("UNAUTHORIZED");
    }
  });
})



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
