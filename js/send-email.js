// init EmailJS with your public key

// init EmailJS 
const emailPublicKey = "klMu4eDAj7AWCAxKg";
emailjs.init(emailPublicKey);

// Function to send email
async function sendEmail(name, email, message) {
    try {
        console.log("Sending email to:", email);

        const response = await emailjs.send(
            "service_b5fhfjg",
            "template_102qulx",
            {
                to_name: name,
                to_email: email,
                message: message,
            }
        );
        alert("Email sent!");
        return true;
    } catch (err) {
        console.error("FAILED...", err);
        alert("Failed to send email. Please try again later.");
        return false;
    }
}
