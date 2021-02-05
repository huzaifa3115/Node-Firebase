
var firebaseConfig = {
    apiKey: "AIzaSyDWUiqFBirwDs03CwSpv6Tm8f1VKKatTp8",
    authDomain: "node-firebase-auth-ead8d.firebaseapp.com",
    databaseURL: "https://node-firebase-auth-ead8d-default-rtdb.firebaseio.com",
    projectId: "node-firebase-auth-ead8d",
    storageBucket: "node-firebase-auth-ead8d.appspot.com",
    messagingSenderId: "583909035580",
    appId: "1:583909035580:web:559ee8a57d895394e23d39",
    measurementId: "G-277B7P8LGH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
const firebaseUiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            if (authResult && authResult.user) {
                let user = authResult.user;

                user.getIdToken().then((idToken) => {
                    fetch("/authLogin", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "CSRF-Token": document.getElementById("_csrf").value,
                        },
                        body: JSON.stringify({ idToken, data: { login: user.displayName, userId: user.uid } }),
                    }).then(() => {
                        // alert('huzaif');
                        window.location.assign("/profile");
                    }).catch((error) => {
                        if (error) {
                            alert(error.message);
                        }
                    })
                });
            }
            return false
        },
        uiShown: () => {
            document.querySelector('#loader').style.display = 'none';
        },
    },
    signInFlow: 'popup',
    // signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    tosUrl: 'https://example.com/terms',
    privacyPolicyUrl: 'https://example.com/privacy',
};

firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        document.querySelector('#loader').style.display = 'none';
        document.querySelector('main').style.display = 'block';
        currentUser = firebaseUser.uid;
        startDataListeners();
    } else {
        // document.querySelector('main').style.display = 'none';
        firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);
    }
});

signout()

function signout(params) {
    firebase.auth().signOut()
}