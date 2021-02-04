// // FirebaseUI config.
// var uiConfig = {
//     signInSuccessUrl: 'profile.ejs',
//     signInOptions: [

//const { event } = require("firebase-functions/lib/providers/analytics");

//             firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//             firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//             firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//             firebase.auth.GithubAuthProvider.PROVIDER_ID,
//             firebase.auth.EmailAuthProvider.PROVIDER_ID,

//          firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
//     ],

//     tosUrl: 'login.ejs'
//   };

//   var ui = new firebaseui.auth.AuthUI(firebase.auth());

//   ui.start('#firebaseui-auth-container', uiConfig);
// Initialize the FirebaseUI Widget using Firebase.
var firebaseConfig = {
  apiKey: "AIzaSyDXyj-W2Fo-aVfjf9tUycvCnMa1ynbFJus",
  authDomain: "newfirebase-2b3f0.firebaseapp.com",
  projectId: "newfirebase-2b3f0",
  storageBucket: "newfirebase-2b3f0.appspot.com",
  messagingSenderId: "349239003630",
  appId: "1:349239003630:web:c4aea0c182fa7af79966ff",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// var firebase = require("firebase");
// var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "/",
  privacyPolicyUrl: "/",

  callbacks: {
    signInSuccess: function (user, credential, redirectUrl) {
      // User successfully signed in.
      user
        .getIdToken()
        .then(function (idToken) {
          window.location.href = "/authLogin/" + idToken;
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
};
// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);
