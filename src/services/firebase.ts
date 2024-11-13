import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCL2Frmji9xrGwq0Zg8NHa3QWSnorSyRU8",
  authDomain: "mystic-balls.firebaseapp.com",
  projectId: "mystic-balls",
  storageBucket: "mystic-balls.firebasestorage.app",
  messagingSenderId: "980362413343",
  appId: "1:980362413343:web:1397ec1ad3f04b3902dc2a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const createUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      readingsCount: 0,
      isPremium: false,
      createdAt: new Date().toISOString(),
    });
  }

  return userRef;
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const incrementReadingCount = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    readingsCount: increment(1),
    lastReadingDate: new Date().toISOString(),
  });
};

export const updatePremiumStatus = async (userId: string, isPremium: boolean) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    isPremium,
    updatedAt: new Date().toISOString(),
  });
};