import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


export default function GoogleLoginButton() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleCredentialResponse = async (response) => {
    try {
      console.log("Google Response:", response);

      // response.credential is a JWT (Google ID token)
      const googleIdToken = response.credential;

      await api.post("/api/auth/google", {
        credential: googleIdToken,
      });

      console.log("Logged in via Google");
      navigate("/restaurant"); // redirect after login
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 240,
    });
  }, []);

  return <div ref={buttonRef}></div>;
}
