const admin = require("firebase-admin");

exports.getIDByToken = async (sessionCookie) => {
    await admin
        .auth()
        .verifyIdToken(sessionCookie)
        .then((decodedToken) => {
            uid = decodedToken.uid;
            console.log(uid, 'uid');
            return uid;
        })
        .catch((error) => {
            // Handle error
            return 'huzafa';
        });
}