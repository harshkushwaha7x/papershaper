// src/contexts/AuthContext.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  applyActionCode,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../../firebase";

interface User {
  name: string;
  email: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; error?: unknown }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (code: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUserInState = (userData: any) => {
    const updatedUser: User = {
      name: userData.displayName || "Unknown",
      email: userData.email || "",
      photoURL: userData.photoURL,
      emailVerified: userData.emailVerified || false,
    };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      updateUserInState(userCredential.user);
      return true;
    } catch (error) {
      console.error("Google login failed:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (!userCredential.user.emailVerified) {
        throw new Error("Please verify your email before logging in");
      }
      updateUserInState(userCredential.user);
      return true;
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later";
          break;
        case "auth/user-disabled":
          errorMessage = "Account disabled. Contact support";
          break;
        default:
          if (error.message.includes("verify your email")) {
            errorMessage = error.message;
          }
      }
      throw new Error(errorMessage);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;

      await sendEmailVerification(userData);
      updateUserInState(userData);

      return {
        success: true,
        message: "Verification email sent. Please check your inbox.",
      };
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error: error };
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      await applyActionCode(auth, code);
      const user = auth.currentUser;
      if (user) await user.reload();
      return true;
    } catch (error) {
      console.error("Email verification failed:", error);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verifyEmail,
        sendVerificationEmail,
        logout,
        resetPassword,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
