// main

// display current user 
const loggedUser = sessionStorage.getItem("user") 

console.log("Logged user details: ", loggedUser);

document.getElementById("loggedUser").innerText = loggedUser ? JSON.parse(loggedUser).userName : "Anonymous";

