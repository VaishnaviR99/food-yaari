import React, { useState } from "react";
import "../Styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
} from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db, googleProvider } from "../Firebase/firebaseConfig";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
  


    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      localStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );

      toast.success("Logged in successfully!", {
        onClose: () => navigate("/")
      });
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email. Please sign up first.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else {
        toast.error("Login failed. Try signing in with Google instead.");
        console.error("Login error:", error);
      }
    }
  };

  const handleGoogleLogin = async () => {
    signInWithPopup(auth,  googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        
        localStorage.setItem(
          "userData",
          JSON.stringify({
            uid: user.uid,
            username: user.displayName,
            email: user.email,
          })
        );
        toast.success("Logged in with Google successfully!", {
          onClose: () => navigate("/")
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        const email = error.customData.email;
        
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(
          `Error: ${errorMessage} emailUsed: ${email} credential: ${credential}`
        );
      });
  };
  return (
    <div id="loginContainer">
       <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section className="authSection">
        <h2>LOGIN</h2>
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="inputField"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="inputField"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button id="login" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account?
          <Link to={"/signup"} className="redirectLink">
            {" "}
            <span>Sign Up</span>
          </Link>
        </p>
        <hr />
        <button className="googleAuth" onClick={handleGoogleLogin}>
          Sign In with Google <FcGoogle className="googleIcon" />{" "}
        </button>
      </section>
    </div>
  );
};
