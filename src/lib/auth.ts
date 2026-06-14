import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = async (email: string, password: string, displayName?: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: serverTimestamp(),
      isPremium: false,
    });
  } catch {
    // User created, profile sync is best-effort
  }
  return cred;
};

export const signOutUser = () => firebaseSignOut(auth);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const updateUserProfile = async (user: User, data: Record<string, any>) => {
  try {
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
  } catch { /* noop */ }
  if (data.displayName) {
    try { await updateProfile(user, { displayName: data.displayName }); } catch { /* noop */ }
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};
