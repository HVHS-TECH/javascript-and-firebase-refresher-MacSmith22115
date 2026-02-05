import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {getDatabase, set, ref, get, off,onValue,update, query,remove, orderByValue} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

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

    document.getElementById("firebase-btn").onclick = async () => {
        if (firebaseInput.value == undefined || firebaseInput.value == null || firebaseInput.value == ""){
            alert("Please type into the input");
        } else {
            const name = await fb_auth();   
            fb_update(`messages/${name.uid}`, {
                sender: name.name,
                [Date.now()] : firebaseInput.value
            })
        }
    }

    document.getElementById("firebase-read-btn").onclick = async () => {
        var msgs = await fb_read("messages");
        const list = document.getElementById("msg-list");
        while (list.firstChild){
            list.removeChild(list.firstChild);
        }

        if (msgs != null) {
            const messageList = new Map();
            for (const [uid, userData] of Object.entries(msgs)){
                for (const [field, value] of Object.entries(userData)){
                    if (field == "sender") continue;
                    messageList.set(field, {
                        sender : userData.sender,
                        msg : value
                    })
                }
            }
            const sortedEntries = Array.from(messageList.entries()).sort((a, b) => {
                return a[0] - b[0];
            })

            const sortedMap = new Map(sortedEntries);

            sortedMap.forEach((v, k) => {
                const li = document.createElement("li");
                li.textContent = `${v.sender}: "${v.msg}"`;
                const list = document.getElementById("msg-list");
                list.appendChild(li);
            })
            document.getElementById("heading").innerHTML = msgs;
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

    async function fb_auth() {
        const PROVIDER = new GoogleAuthProvider();
        PROVIDER.setCustomParameters({prompt: 'select_account'});
        try {
            const RESULT = await signInWithPopup(getAuth(), PROVIDER);
            return {
                name : RESULT.user.displayName,
                uid : RESULT.user.uid
            }
        } catch (_error){
            alert(`Encounted an Error during Auth: ${_error}`)
            return null;
        }
    }

    async function fb_update(_path, _data, _then = null){
        try{
            await update(ref(getDatabase(app), _path), _data);
            if(_then != null) _then();
        } catch (_error){
            const MSG = `Error Updating ${_data} @ "${_path}": ${_error}`
            console.error(MSG)
            alert(`Firebase Error Updating Data: See Console`);
        }
    }

