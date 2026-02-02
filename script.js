import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAOPnMr_-61TVbtvgW3VWvh6af_KOPYwk",
    authDomain: "comp-firebase-revision.firebaseapp.com",
    projectId: "comp-firebase-revision",
    storageBucket: "comp-firebase-revision.firebasestorage.app",
    messagingSenderId: "1028621260717",
    appId: "1:1028621260717:web:28f92cc83af73f2655f324"
};

const app = initializeApp(firebaseConfig);
    
var messageSpace = document.getElementById("welcomeMessage");
messageSpace.innerHTML = "You've connected to the JavaScript!";


