var parsedUrl = new URL(window.location.href);

//if signup button is pressed this sends them to that page
function register(){
    window.location.href = "/register.html"
}

//if the blog button is pressed this sends them to that page with their jwt token
function blog(){
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    window.location.href = '/index.html?'+querystring 
}

//if recipe 1 button is pressed this sends them to that page with their jwt token
function recipe1(){
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    window.location.href = '/recipe1.html?'+querystring 
}

//if recipe 2 button is pressed this sends them to that page with their jwt token
function recipe2(){
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    window.location.href = '/recipe2.html?'+querystring 
}

//if recipe 3 button is pressed this sends them to that page with their jwt token
function recipe3(){
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    window.location.href = '/recipe3.html?'+querystring 
}

//if recipe 4 button is pressed this sends them to that page with their jwt token
function recipe4(){
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    window.location.href = '/recipe4.html?'+querystring 
}

//takes the comments from the db and puts them in the <textarea> on the page
//needs what recipe page it is on
function commentSection(recipe){
    fetch("http://"+parsedUrl.host+"/getComments",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipe:recipe})
    })
    .then((resp) => 
        resp.text()
    )
    .then((data) => {
        //multiple comments are combined
        console.log(data)
        str = ""
        data1 = (JSON.parse(data))
        console.log(data1[1]['comment'])
        for(var i = 0; i < data1.length; i++){
            str = str + data1[i]['username'] + "\t\t\t\t" + data1[i]['comment'] + "\n"
        }
        document.getElementById("commentSection").innerHTML =  str
        //if api sends 401 message go back to login page
        if(data == "401"){
            window.location.href = "/"
        }

    })
    .catch((err) => {
        console.log(err);
    })
}

//submit comment section
function submitComment(recipe,comment){
    const url = window.location.href
    const searchParams = new URL(url).searchParams
    const querystring = new URLSearchParams(searchParams)
    tokenarr = Array.from(querystring)
    //sends recipe number, comment, and jwt
    fetch("http://" + parsedUrl.host + "/comments", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipe:recipe,comment:comment.value,token:tokenarr})
    })
    .then((resp) =>
        resp.text()
    )
    .then((data) => {
        //if no account signed in alters to signin
        if(data == "error"){
            alert("No account. Please sign in to submit comments")
        }
    })
    .catch((err) =>{
        console.log(err)
    })
    //reloads the comment section when comment is submitted
    commentSection(recipe)
}

//registration function
//takes username, password, email, and role (country)
function registered(user,passwd,email,role) {
    fetch("http://" + parsedUrl.host + "/register",{
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body:JSON.stringify({username:user.value,password:passwd.value,email:email.value,role:role.value})
    })
    .then(async (response) => {
        if(response.status == 200){
            alert("Account Registered")
            window.location.href = "/login.html"
        }
    })
    .then((data) => {

    })
    .catch((err) => {
        console.log(err);
    })
}


//logout button
function logout(){
    window.location.href = '/login.html'
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
        body: JSON.stringify(tokenarr)
    })
        .then( async (response) => {
            text = await response.text()
            console.log(response.status)
            if(text == 'admin'){
                window.location.href = '/query.html?'+querystring;
            }
            //if status is OK move to query page
            else if(response.status == 200){
                window.location.href = "/index.html?"+querystring;
            }
            else{
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
