"use client";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default function EmailLinkAuthHandler() {
  useEffect(() => {
    (async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem("emailForSignIn") || "";
          if (!email) email = window.prompt("Please provide your email for confirmation") || "";
          if (email) {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            alert("Signed in successfully.");
          }
        }
      } catch (e) { console.warn(e); }
    })();
  }, []);
  return null;
}