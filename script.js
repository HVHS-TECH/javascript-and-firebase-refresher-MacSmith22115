    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
    import {getDatabase, set, ref, get, off,onValue,update, query,remove, orderByValue} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSyCAOPnMr_-61TVbtvgW3VWvh6af_KOPYwk",
        authDomain: "comp-firebase-revision.firebaseapp.com",
        projectId: "comp-firebase-revision",
        storageBucket: "comp-firebase-revision.firebasestorage.app",
        messagingSenderId: "1028621260717",
        appId: "1:1028621260717:web:28f92cc83af73f2655f324",
        databaseURL: "https://comp-firebase-revision-default-rtdb.firebaseio.com/"
    };

    const app = initializeApp(firebaseConfig);
    var messageSpace = document.getElementById("welcomeMessage");
    var input = document.getElementById("input");
    var firebaseInput = document.getElementById("firebase-input");

    messageSpace.innerHTML = "You've connected to the JavaScript!";

    document.getElementById("btn").onclick = () => {
        var msg;
        if (input.value == undefined || input.value == null || input.value == ""){
            msg = "Please enter text in input, then try again"
        } else {
            msg = input.value;
        }

        document.getElementById("heading").innerHTML = msg;
    }

    document.getElementById("firebase-btn").onclick = () => {
        if (firebaseInput.value == undefined || firebaseInput.value == null || firebaseInput.value == ""){
            alert("Please type into the input");
        } else {
            fb_write(`message`, firebaseInput.value, (_data, _path) => {
                alert(`Sucessfully Wrote ${_data} @ ${_path}`);
            })
        }
    }

    document.getElementById("firebase-read-btn").onclick = async () => {
        var msg = await fb_read("message");
        if (msg != null) {
            document.getElementById("heading").innerHTML = msg;
        } else {
            alert("No Message Data Found")
        }
    }

    async function fb_read(_path) {
        try {
            const snapshot = await get(ref(getDatabase(app), _path))
            return snapshot.exists() ? snapshot.val() : null;
        } catch (_error){
            alert(`Error Reading Data @ ${_path}: ${_error}`)
        }
    }

    async function fb_write(_path, _data, _callback = null) {
        try {
            await set(ref(getDatabase(app), _path), _data)
            if (_callback != null && _callback instanceof Function) _callback(_data, _path);
        } catch (_error){
            alert(`Error Writing ${_data} @ ${_path}: ${_error}`);
        }
    }

