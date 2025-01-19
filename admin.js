const admin = require('firebase-admin')

const serviceAccount = require("./src/keys/firebase-admin-sdk-keys.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

admin.auth().listUsers(100).then(users => {
    users.users.forEach(user => {
        // Use user.uid to create a unique document ID
        const userRef = db.collection('users').doc(user.uid);

        userRef.set({
            displayName: user.displayName || "",
            email: user.email || "",
            profileImageUrl: user.photoURL || "",
            userId: user.uid,
            gender: ["male", "female", "unidentified"][Math.floor(Math.random() * 3)],
            phoneNumber: user.phoneNumber || ""
        })
        .then(() => {
            console.log(`User ${user.uid} added successfully!`);
        })
        .catch(err => {
            console.error('Error adding user:', err);
        });
    });
}).catch(err => console.error('Error listing users:', err));
