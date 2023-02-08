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


const app = express();
app.use(express.json());


let connection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});


app.use("/", express.static("frontend"));

//registration route
app.post("/register", async (request, response) =>{
  var data = request.body
  var username = data['username']
  var password = data['password']
  //creates a hash of the password
  var password_hash = createHash('sha256').update(password).digest('hex');
  var email = data['email']
  var role = data['role'] + (Math.floor(Math.random()*90) + 10)

  try{
    //inserts into table
    const sql = `INSERT INTO users (username, password, email, role ) VALUES (?, ?, ?, ?)`;
    const values = [username, password_hash, email, role];

    connection.query(sql, values, function(err, result) {
      
      if (err) {
        console.log(err);
      }else{
        console.log("1 record inserted", result.affectedRows)
        console.log(role)
        response.send(role)
      }
    })
  }catch{
    response.send("error")
  }
})

//gets comments from database
app.post("/getComments", async (request,response) => {
  var data = request.body
  SQL = "SELECT * FROM comment WHERE blog = ?;" 
  values = [data['recipe']]
  //query's database for the specific entries from the specific recipe page
  connection.query(SQL, values, (error, results, fields) => {
    if (error) {
      console.error(error.message);
      response.status(500).send("database error");
    } else {
      //sends query result
      response.send(JSON.stringify(results));
    }
  })
})

//posts the comment to database
app.post("/comments", async (request, response) => {
  var data = request.body
  console.log(data['comment'])
  try{
    //must have a jwt to submit token
    const arr = jwt.verify(data['token'][0][1],'secret')
    const sql = `INSERT INTO comment (blog, username, comment) VALUES (?, ?, ?)`;
    const values = [data['recipe'], arr['username'], data['comment']];
    console.log(arr['role'])
    connection.query(sql, values, (error, results, fields) => {
      if(error){
        console.log(error)
      }else{
        console.log("comment inserted")
      }
    })
  }catch{
    //if no username or other error send back error message
    console.log("here")
    response.send("error")
  }

})

app.post("/query", async (request, response) => {
  //get the jwt
  var data = request.body;
  SQL = "SELECT * FROM "+data[1]+";"
  //verify
  try{
    const arr = jwt.verify(data[0][1],'secret')
    if(data[1] == "logs" && (arr['role'] == 'admin' || arr['role'] == 'IT')){
      connection.query(SQL, [true], (error, results, fields) => {
        if (error) {
          console.error(error.message);
          response.status(500).send("database error");
        } else {
          //console.log(results);
          response.send(results);
        }
     
     });
    }else if(data[1] == "users" && (arr['role'] == 'admin')){
      connection.query(SQL, [true], (error, results, fields) => {
        if (error) {
          console.error(error.message);
          response.status(500).send("database error");
        } else {
          //console.log(results);
          response.send(results);
        }
      })
    }else if(data[1] == "roles" && (arr['role'] == 'user')){
      connection.query(SQL, [true], (error, results, fields) => {
        if (error) {
          console.error(error.message);
          response.status(500).send("database error");
        } else {
          //console.log(results);
          response.send(results);
        }
      })
    }
    else{
      response.send("unauthorized")
    }
  }catch{
    response.send("401")
  }
})

//generate a code and see if the code passed matches the code generated
app.post("/authCode", async (request, response) => {    
  var data = request.body;
  //console.log(data[0][1])

  token = jwt.verify(data[0][1],'secret')
  role = token['role']
  console.log(role)
  
  code = data[1]["passcode"];

  //get generated code
  var secret_key = role;
  var current_time = Date.now()/1000; //divide by 1000 to truncate microseconds
  var rounded_time_30sec = String(current_time - (current_time % 30));
  var timedata = rounded_time_30sec + secret_key;
  var hashed_code = createHash('sha256').update(timedata).digest('hex');
  var short_hashed_code = hashed_code.substring(0,5);
  
  try{
    const arr = jwt.verify(data[0][1],'secret')

    if ((arr['role'] == 'admin') || arr['role'] == 'IT'){
      //code field is blank
      if (code == '') {
        response.status(400).send();
        console.log("400 blank")

      //if the input code does not match
      } else if (code != short_hashed_code){
        response.status(400).send();
        console.log("400 no match")

      //if the codes match
      } else if (short_hashed_code == code){
        //send 200 OK
        response.send("admin");
        console.log("200 OK")   
      }
    }else{
      //code field is blank
      if (code == '') {
      response.status(400).send();
      console.log("400 blank")
    
      //if the input code does not match
      } else if (code != short_hashed_code){
      response.status(400).send();
      console.log("400 no match")
      
      //if the codes match
      } else if (short_hashed_code == code){
      //send 200 OK
      response.status(200).send();
      console.log("200 OK") 
      }
    }
  }catch{

  }
})

app.post("/login", async (request, response) => {
  //recieves the username and password
  var data = request.body;
  // hashes pass word
  const hashpass2 = await hashPassword(data['password']);
  //console.log(hashpass2)
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
        fillLogs(data, false)
        //if the input password matches input username password from query
      } else if (data['password'] == ''){
        //  if password is blank
        response.status(400).send("UNAUTHORIZED");
        fillLogs(data, false)
        //compares hashed password in database with hashed and salted password given from user.
      } else if (await bc.compare(results[0]['password'], hashpass2)){
        //create token
        var token = jwt.sign(results[0], "secret", {expiresIn:"600s"}) //10 min expiration
        //send 200 OK
        console.log("200 OK")
        fillLogs(data,true)
        //send token to common.js
        response.send(token)
        
      } else {
        //if username/password are not in database in correct order prevent login
        //console.log(bc.compare(results[0]['password']))
        response.status(400).send("UNAUTHORIZED");
        fillLogs(data, false)
      }
    } catch (error){
      console.log("--UNAUTHORIZED");
      //console.log(error)
      response.status(400).send("UNAUTHORIZED");
      //await fillLogs(data);
    }
  });
})


async function hashPassword(password){
  //console.log(data)
  var salt = await bc.genSalt();
  // hashes password gotten from user
  var hashpass = createHash('sha256').update(password).digest('hex');
  //console.log(hashpass)
  //hashes password again using bcrypt
  var hashpass1 = await bc.hash(hashpass, salt);
  //console.log(typeof(hashpass1))
  return hashpass1
}

async function fillLogs(userInfo, success){
  var username = "" + userInfo["username"] + "";
  var password = await hashPassword(userInfo['password'])
  var success = success;
  var timeStamp = Math.floor(Date.now() / 1000);
  var auth = true; // success if double authentication code matches

  const sql = `INSERT INTO logs (username, password, timestamp, success, auth) VALUES (?, ?, ?, ?, ?)`;
  const values = [username, password, timeStamp, success, auth];

  connection.query(sql, values, function(err, result) {
    //console.log(values)
    if (err) {
      console.log(err);
    }else{console.log("1 record inserted", result.affectedRows)}
  })
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
