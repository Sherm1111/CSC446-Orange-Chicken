var parsedUrl = new URL(window.location.href);
<<<<<<< HEAD
=======

>>>>>>> 672146f1775afda3c5970adbaf2d2f5347f440ec


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
        //if status is OK move to query page
        if(response.status == 200){
            window.location.href = "/query.html?"+querystr;
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
<<<<<<< HEAD
	const tableAccessed = document.getElementById("databaseAccess");
	var tableSelected = tableAccessed.options[tableAccessed.selectedIndex].value;
	console.log(tableSelected);
	
=======
    //select a table
    const tableAccessed = document.getElementById("databaseAccess");
    var tableSelected = tableAccessed.options[tableAccessed.selectedIndex].value;
    //add logs to token array to send to api
    tokenarr.push(tableSelected)
>>>>>>> 672146f1775afda3c5970adbaf2d2f5347f440ec
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
<<<<<<< HEAD
=======
	
	
>>>>>>> 672146f1775afda3c5970adbaf2d2f5347f440ec
}
