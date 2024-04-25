import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase";
import React from "react";
import "./Auth.scss";

const Auth = () => {
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // console.log(result.user);
  }

  return (
    <div className="authContainer">
      <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;
