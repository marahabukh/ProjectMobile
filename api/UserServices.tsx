// UserServices.ts
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";



// تسجيل حساب جديد
export const registerUser = async (email: string, password: string, name?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }

  return userCredential;
};

// تسجيل دخول
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};