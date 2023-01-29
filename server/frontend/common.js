
// const { createHash } = require('crypto');
var parsedUrl = new URL(window.location.href);


//logout button
function logout(){
    window.location.href = '/'
}

function login(usr,passwd) {
    //post request
    fetch("http://" + parsedUrl.host + "/login", {
        method: "POST",
        //specify what is being sent (json)
        headers: {'Content-Type': 'application/json'},
        //username and password in json format (dictionary)
        body: JSON.stringify({username:usr.value, password:passwd.value})
    })
    .then(async (response) => {
        //get jwt token
        token = await response.text()
        //query string
        const usp = new URLSearchParams('token='+token)
        const querystr = usp.toString()
        //prints to console the status
        console.log(response.status)
        //if status is OK move to code authentication page
        if(response.status == 200){
            window.location.href = "/codeauth.html?"+querystr;;
        }
        else{
            alert("username or password does not match");
        }
    })
    .then((data) => {
        console.log()
    })
    //catch errors
    .catch((err) => {
        console.log(err);
    })
}

function query() {
    //get token from URL
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    const tokenarr = Array.from(querystring)
    //select a table
    const tableAccessed = document.getElementById("databaseAccess");
    var tableSelected = tableAccessed.options[tableAccessed.selectedIndex].value;
    //add logs to token array to send to api
    tokenarr.push(tableSelected)
    fetch("http://" + parsedUrl.host + "/query", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tokenarr)
    })
    .then((resp) =>
        resp.text(),
    
    )
    .then((data) => {
        document.getElementById("response").innerHTML = data;
        //if api sends 401 message go back to login page
        if(data == "401"){
            window.location.href = "/"
        }

    })
    .catch((err) => {
        console.log(err);
    })
}

//  ------------------------------------------ Issues Start Here ------------------------------------------  //
function authenticate(code) {
    //get token from URL
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    const tokenarr = Array.from(querystring)
    //add logs to token array to send to api
    tokenarr.push({passcode:code.value})
    //post request
    fetch("http://" + parsedUrl.host + "/authCode", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({passcode:code.value})
    })
        .then(async (response) => {
            //                      <-------------- The code seems to never reach this point. But we know it runs all the code above since we get the 200OK printed from the /authCode Post in index.js
            console.log("break") //this was only added as a makeshift "break point" to see if this line was reached
            //if status is OK move to query page
            if(response.status == 200){
                window.location.href = "/query.html?"+querystr;;
            }
            else{
                console.log("break2")
                alert("code entered is incorrect");
            }
        })
        .then((data) => {
            console.log()
        })
        //catch errors
        .catch((err) => {
            console.log(err);
        })
}
