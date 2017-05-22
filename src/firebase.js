import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyBVmHgITtWprjrJDiMoQkPYzsMy8MUx38Q',
    authDomain: 'whichcraft.firebaseapp.com',
    databaseURL: 'https://whichcraft.firebaseio.com',
    projectId: 'firebase-whichcraft',
    storageBucket: 'firebase-whichcraft.appspot.com',
    messagingSenderId: '147275854202'
};

firebase.initializeApp(config);

export default firebase;
