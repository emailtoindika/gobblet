// init EmailJS with your public key
emailjs.init(
    "klMu4eDAj7AWCAxKg",
);

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

        console.log("SUCCESS!", response);
        alert("Email sent!");
    } catch (err) {
        console.error("FAILED...", err);
    }
}
