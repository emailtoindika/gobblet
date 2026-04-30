// feedback 
import { saveFeedback } from './db-connector.js';

window.addEventListener('DOMContentLoaded', function(){
    // add event to user name 
    let userName = document.getElementById("username");
    userName.addEventListener("focusout", (e) => checkUserName(e));

    // add event to email 
    let email = document.getElementById("email");
    email.addEventListener("focusout", (e) => checkEmail(e));

    // add event to comments 
    let comments = document.getElementById("comments");
    comments.addEventListener("focusout", (e) => checkComments(e));

    // add event for submit 
    const submit = document.getElementById('feedbackButton');
    submit.addEventListener('click', handleSubmit);
})

// check user name
function checkUserName(e) {
    let displayMsg = "";
    if (e.target.value == "") {
        displayMsg = "<span> User Name is blank... </span>";
    }
    let divMsg = document.getElementById("username-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

// check email address
function checkEmail(e) {
    let displayMsg = "";
    if (e.target.value == "") {
        displayMsg = "<span> Email is blank... </span>";
    }

    let divMsg = document.getElementById("email-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

// check comments
function checkComments(e) {
    let displayMsg = "";
    if (e.target.value == "") {
        displayMsg = "<span> Comments are blank... </span>";
    }

    let divMsg = document.getElementById("comments-error");
    divMsg.innerHTML = displayMsg;
    divMsg.className = "error-lable";
}

function validateForm() {
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const comments = document.getElementById('comments').value;

    if (name === '' || email === '' || comments === '') {
        alert('Please fill in all fields.');
        return false;
    }
    return true;
}

async function handleSubmit(event){
    event.preventDefault();

    if (!validateForm()) {
        return;
    }
    
    // get details
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('comments').value;
    const rating = document.querySelectorAll('input[name="rating"]');
    let ratingValue = 0;
    rating.forEach(element => {
        if (element.checked === true ){
            ratingValue = parseInt(element.getAttribute('aria-valuetext'));
        }
    });


    const feedback = {
        name: name,
        email: email,
        message: message,
        rating: ratingValue
    };

    console.log(feedback);
    // save feedback
    const result = await saveFeedback(feedback);

    if (result) {
        alert('Thank you for your feedback!');
        // clear form
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('comments').value = '';
        const ratings = document.querySelectorAll('input[name="rating"]')
        ratings.forEach(element => {
            element.checked = false;
        });
    }
}