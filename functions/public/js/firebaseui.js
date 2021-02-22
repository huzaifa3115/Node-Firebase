
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
const firebaseUiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            console.log(authResult.user);
            if (authResult && authResult.user) {
                const user = authResult.user;

                user.getIdToken().then((idToken) => {
                    fetch('/authLogin', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'CSRF-Token': document.getElementById('_csrf').value,
                        },
                        body: JSON.stringify({ idToken, data: { login: user.displayName, userId: user.uid } }),
                    }).then(() => {
                        // alert('huzaif');
                        window.location.assign('/profile');
                    }).catch((error) => {
                        if (error) {
                            alert(error.message);
                        }
                    });
                });
            }
            return false;
        },
        uiShown: () => {
            document.querySelector('#loader').style.display = 'none';
        },
    },
    signInFlow: 'popup',
    // signInSuccessUrl: '/',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,

        },
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        },
        {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        },
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    tosUrl: 'https://example.com/terms',
    privacyPolicyUrl: 'https://example.com/privacy',
};

firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);