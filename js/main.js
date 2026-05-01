// main

// display current user 
const loggedUser = sessionStorage.getItem("user") 
document.getElementById("loggedUser").innerText = loggedUser ? JSON.parse(loggedUser).userName : "Anonymous";

