// sign in js
import { getUserByEmail } from "./db-connector.js";

window.addEventListener("DOMContentLoaded", async ()=>{

    // add event to email
    let email = document.getElementById("email");
    email.addEventListener("focusout", (e) => checkEmail(e));

    // add event to password
    let password = document.getElementById("password");
    password.addEventListener("focusout", (e)=> checkPassword(e));

    // add event to sign in button
    let signInButton = document.getElementById("signInButton");
    signInButton.addEventListener("click", submitForm);
});

// check email address
function checkEmail(e){
    let displayMsg = "";
    if (e.target.value == ""){
        displayMsg = "<span> Email is blank... </span>";
    }
    
    let divMsg = document.getElementById("confirm-email-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

// check password
function checkPassword(e){
    let displayMsg = "";
    if (e.target.value == ""){
        displayMsg = "<span> Password is blank... </span>";
    }
    let divMsg = document.getElementById("confirm-password-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

 async function submitForm(){
    // validate form and submit to server
    console.log("form submitted...");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // get user details by email 
    const user = await getUserByEmail(email);

    console.log("User details retrieved: ", user);

    if (user && user.password === password){
        if (user.isActive){
            // save user details to session storage
            sessionStorage.setItem("user", JSON.stringify(user));

            // redirect to home page
            window.location.href = "index.html";
        } else {
            alert("Your account is not activated. Please check your email for activation link.");
        }
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

function handleCredentialResponse(response) {
    // save user details to session storage
    sessionStorage.setItem("user", JSON.stringify(response.credential));

    // redirect to home page
    window.location.href = "index.html";
}