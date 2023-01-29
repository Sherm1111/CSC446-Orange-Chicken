
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

async function authenticate(code) {    
    //get generated code
    var secret_key = "secret";
    var current_time = Date.now();
    var rounded_time_30sec = String(current_time - (current_time % 30));
    var data = rounded_time_30sec + secret_key;
    var hashed_code = createHash('sha256').update(data).digest('hex');
    var short_hashed_code = hashed_code.substring(0,5);
    console.log(short_hashed_code);
    if(short_hashed_code == code){
        window.location.href = "/codeauth.html";
    }
    else{
        alert("incorrect code");
    }


}
