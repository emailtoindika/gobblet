
// user registration

import { saveUser } from "./db-connector.js";

// add events 
window.addEventListener("DOMContentLoaded", () => {
    // add event to user name 
    let userName = document.getElementById("username");
    userName.addEventListener("focusout", (e) => checkUserName(e));

    // add event to email 
    let email = document.getElementById("email");
    email.addEventListener("focusout", (e) => checkEmail(e));

    // add event to password
    let password = document.getElementById("password");
    password.addEventListener("focusout", (e) => checkPassword(e));

    // add event to confirm password
    let confirmPassword = document.getElementById("confirm-password");
    confirmPassword.addEventListener("focusout", matchPassword);

    // add event to register button
    let registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", submitForm);
});

// check user name
function checkUserName(e) {
    let displayMsg = "";
    if (e.target.value == "") {
        displayMsg = "<span> User Name is blank... </span>";
    }
    let divMsg = document.getElementById("confirm-username-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

// check email address
function checkEmail(e) {
    let displayMsg = "";
    if (e.target.value == "") {
        displayMsg = "<span> Email is blank... </span>";
    }

    let divMsg = document.getElementById("confirm-email-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

// check password
function checkPassword(e) {
    let displayMsg = "";
    if (e.target.value == "") {
        displayMsg = "<span> Password is blank... </span>";
    }
    let divMsg = document.getElementById("password-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

// match passwords
function matchPassword() {
    console.log("matchpassword")
    let strPassword = document.getElementById('password').value;
    let strConfirmPassword = document.getElementById('confirm-password').value;

    // check the password and confirm password are match
    if (strPassword === strConfirmPassword) {
        return true;
    }

    let displayMsg = "<span> Password and confirm passwords are not matching... </span>";
    let divMsg = document.getElementById("confirm-password-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
    return false;
}

// submit form
async function submitForm(e) {
    e.preventDefault();
    if (matchPassword()) {
        // retrieve user details from form
        let userName = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        // create user object
        let user = {
            userName: userName,
            email: email,
            password: password,
            isActive: false
        };

        // save user details to db
        const userId = await saveUser(user);

        // retrieve domain url
        const DOMAIN_URL = "https://emailtoindika.github.io/gobblet/";

        // send activate account email
        const activationLink = `${DOMAIN_URL}activate.html?userId=${userId}`;
        const activateMessage = `Welcome to our service! Please activate your account using the following link: ${activationLink}`;
        const emailSent = await sendEmail(userName, email, activateMessage);

        if (emailSent) {
            // clear form inputs
            document.getElementById("username").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirm-password").value = "";
        }
    }
}
