import { getUserById, activateUser } from "./db-connector.js";

// account activation
window.addEventListener("load", async () => {
    console.log("Activate account page loaded...");
    // get user id from url
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    console.log("User ID from URL:", userId);

    const messageContainer = document.getElementById("message");

    if (userId) {
        const user = await getUserById(userId);
        if (user) {
            if (user.isActive) {
                messageContainer.innerHTML = "<span>Your account is already activated. You can log in.</span>";
                return;
            }
            console.log("User details:", user);
            // Activate the user account
            await activateUser(userId);
            messageContainer.innerHTML = "<span>Your account has been activated successfully! You can now log in.</span>";
        } else {
            messageContainer.innerHTML = "<span>Invalid activation link. User not found.</span>";
        }
    } else {
        messageContainer.innerHTML = "<span>No user ID provided in URL.</span>";
    }
});