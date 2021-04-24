import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyC1Q9ZsE5LUwehqIQC0rHV9I4tThmIcGeU",
    authDomain: "crown-shopping-98a3c.firebaseapp.com",
    projectId: "crown-shopping-98a3c",
    storageBucket: "crown-shopping-98a3c.appspot.com",
    messagingSenderId: "282537468864",
    appId: "1:282537468864:web:12a345e481c4fd04afde25",
    measurementId: "G-W0GKQ867Z5"
}

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
