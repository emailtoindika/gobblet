import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, getDoc,getDocs, doc ,query, where} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// configuration 
const firebaseConfig = {
    apiKey: "AIzaSyDHlTHShYeqIvrzFPWueOE718GBp6wSlmo",
    authDomain: "tiktaktoe-a07e7.firebaseapp.com",
    projectId: "tiktaktoe-a07e7",
    storageBucket: "tiktaktoe-a07e7.firebasestorage.app",
    messagingSenderId: "40044711006",
    appId: "1:40044711006:web:0d01e99bf03eacc63538cf",
    measurementId: "G-225GV86ESK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// save user details 
async function saveUser(user) {
    // save user to db
    try {
        console.log("Saving user to db:", user);
        const docRef = await addDoc(collection(db, "users"), user);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

async function getUserById(userId) {
    // get user details by id
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error : ", error);
        return null;
    }
}

async function activateUser(userId) {
    // activate user account
    try {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, { isActive: true });
        console.log("User account activated successfully.");
    } catch (error) {
        console.error("Error activating user account: ", error);
    }
}

async function getUserByEmail(email) {
    // get user details by email
    try {
        const docRef = query(collection(db, "users"), where("email", "==", email));
        const docSnap = await getDocs(docRef);
        if (!docSnap.empty) {
            return docSnap.docs[0].data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error : ", error);
        return null;
    }
}

async function saveFeedback(feedback) {
    // save feedback to db
    try {
        const docRef = await addDoc(collection(db, "feedback"), feedback);
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        return false;
    }
}

export { db, saveUser, getUserById, activateUser, getUserByEmail, saveFeedback };