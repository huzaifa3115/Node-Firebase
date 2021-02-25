const STRIPE_PUBLISHABLE_KEY = 'pk_test_51IGs8kA2cqiuOMLwr1LfxWdXDSSDOsvZEhAjTBvkIJ42Ig8Vh8bhgiCnv2b5R8IZpHJEmXw72BQQ635ZClbjXJSG00AHK6HuKM';

// Replace with your tax ids
// https://dashboard.stripe.com/tax-rates
const taxRates = ['txr_1HCshzHYgolSBA35WkPjzOOi'];
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

                if (!user.emailVerified) {
                    user.sendEmailVerification();
                    alert('Please verify your email first');
                    window.location.assign('/login');
                    return false;
                }

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