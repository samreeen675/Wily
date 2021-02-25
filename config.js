import * as firebase from "firebase";
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyDP4YWjBhaxlbDusbh-0sueWHMtUmj5eSc",
    authDomain: "wily-c4356.firebaseapp.com",
    projectId: "wily-c4356",
    storageBucket: "wily-c4356.appspot.com",
    messagingSenderId: "807951227681",
    appId: "1:807951227681:web:48681ac67c2b1a98e27c60"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();