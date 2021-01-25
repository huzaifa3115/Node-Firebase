window.addEventListener("DOMContentLoaded", () => {
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

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    var loginForm = document.getElementById('login');
    var signupForm = document.getElementById('signup');


    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const login = event.target.login.value;
            const password = event.target.password.value;

            firebase
                .auth()
                .signInWithEmailAndPassword(login, password)
                .then(({ user }) => {
                    return user.getIdToken().then((idToken) => {
                        return fetch("/authLogin", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                            },
                            body: JSON.stringify({ idToken, data: { login, userId: firebase.auth().currentUser.uid } }),
                        });
                    });
                })
                .then(() => {
                    return firebase.auth().signOut();
                })
                .then(() => {
                    window.location.assign("/profile");
                }).catch((error) => {
                    if (error) {
                        alert(error.message);
                    }
                });
            return false;
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const login = event.target.login.value;
            const password = event.target.password.value;

            firebase
                .auth()
                .createUserWithEmailAndPassword(login, password)
                .then(({ user }) => {
                    return user.getIdToken().then((idToken) => {
                        return fetch("/authLogin", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                            },
                            body: JSON.stringify({ idToken, data: { login, userId: firebase.auth().currentUser.uid } }),
                        });
                    });
                })
                .then(() => {
                    return firebase.auth().signOut();
                })
                .then(() => {
                    window.location.assign("/profile");
                }).catch((error) => {
                    if (error) {
                        alert(error.message);
                    }
                });
            return false;
        });
    }

    googleSignIn = () => {
        var gProvider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(gProvider)
            .then(({ user }) => {
                console.log('user', user.displayName, user.uid, user.getIdToken())
                return user.getIdToken().then((idToken) => {
                    return fetch("/authLogin", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                        },
                        body: JSON.stringify({ idToken, data: { login: user.displayName, userId: user.uid } }),
                    });
                });
            })
            .then(() => {
                return firebase.auth().signOut();
            })
            .then(() => {
                window.location.assign("/profile");
            }).catch((error) => {
                if (error) {
                    alert(error.message);
                }
            });
    }

});
