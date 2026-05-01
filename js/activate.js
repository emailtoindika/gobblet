import { getUserById, activateUser } from "./db-connector.js";

// account activation
window.addEventListener("load", async () => {
    // get user id from url
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    // get message container
    const messageContainer = document.getElementById("message");

    if (userId) {
        const user = await getUserById(userId);
        if (user) {
            if (user.isActive) {
                // User is already active
                messageContainer.innerHTML = "<span>Your account is already activated. You can log in.</span>";
                return;
            }
            // Activate the user account
            await activateUser(userId);
            messageContainer.innerHTML = "<span>Your account has been activated successfully! You can now log in.</span>";
        } else {
            // User not found
            messageContainer.innerHTML = "<span>Invalid activation link. User not found.</span>";
        }
    } else {
        // No user ID provided in URL
        messageContainer.innerHTML = "<span>No user ID provided in URL.</span>";
    }
});