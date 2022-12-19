var parsedUrl = new URL(window.location.href);


function login(usr,passwd) {
    //post request
    fetch("http://" + parsedUrl.host + "/login", {
        method: "POST",
        //specify what is being sent (json)
        headers: {'Content-Type': 'application/json'},
        //username and password in json format (dictionary)
        body: JSON.stringify({username:usr.value, password:passwd.value}),
    })
    .then(function(response){
        //prints to console the status
        console.log(response.status)
        //if status is OK move to query page
        if(response.status == 200){
            window.location.href = "/query.html";
        }
        else{
            alert("username or password does not match");
        }
    })
    //catch errors
    .catch((err) => {
        console.log(err);
    })
}

function query() {
    fetch("http://" + parsedUrl.host + "/query", {
        method: "GET",
        mode: "no-cors",
    })
    .then((resp) => resp.text())
    .then((data) => {
        document.getElementById("response").innerHTML = data;
    })
    .catch((err) => {
        console.log(err);
    })
}
