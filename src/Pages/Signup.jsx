import { FcGoogle } from "react-icons/fc";
import React,{useState} from 'react'
import "../Styles/Navbar.css"
import { Link, useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth
} from 'firebase/auth';

import { 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  collection, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db, googleProvider } from '../Firebase/firebaseConfig';

export const Signup = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
  
    if (formData.password !== formData.confirmPass) {
      toast.error("Passwords do not match");
      return;
    }
  
   
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
          email: formData.email,
          createdAt: new Date(),
          userType:"user",
          bio:"Welcome to my blog!",
          coverImg:"https://images.unsplash.com/photo-1553342047-1a988767f0de?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoZWNrJTIwbWFya3xlbnwwfHwwfHx8MA%3D%3D",
          profileImg:"https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid",
      });
      toast.success("Signup successful! Redirecting to login.", {
        onClose: () => navigate("/login")
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.info('Email already in use. Redirecting to login...', {
          onClose: () => navigate("/login")
        });
      } else {
        console.error('Error during email signup:', error);
        toast.error('Signup failed. Please try again.');
      }
    }
      

    

    

   
  };

  const handleGoogleSignup = async () => {
   
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
      
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
      

        await setDoc(doc(db, "users", user.uid), {
          username:  user.displayName,
            email: user.email,
            createdAt: new Date(),
            userType:"user",
            bio:"Welcome to my blog!",
            coverImg:"https://images.unsplash.com/photo-1553342047-1a988767f0de?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoZWNrJTIwbWFya3xlbnwwfHwwfHx8MA%3D%3D",
            profileImg:"https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid",
  
        });
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
      }).catch((error) => {
        
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(`Error: ${errorMessage} emailUsed: ${email} credential: ${credential}`);
      });
    
  };

  return (
    <div id='signupContainer'>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="authSection">
      
        <h2>SIGN UP</h2>
        <form onSubmit={handleEmailSignup}>
          <input type="text" name="username" placeholder="Enter Name" className="inputField" value={formData.username}
            onChange={handleChange}
            required/>
          <input type="email" name="email" placeholder="Enter Email" className="inputField" value={formData.email}
            onChange={handleChange}
            required/>
          <input type="password" name="password" placeholder="Enter Password" className="inputField" value={formData.password}
            onChange={handleChange}
            required/>
          <input
            type="password"
            name="confirmPass"
            placeholder="Confirm Password"
            className="inputField"
            value={formData.confirmPass}
            onChange={handleChange}
            required
          />
          <button id="signup" type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to='/login' className="redirectLink"> <span > Login</span></Link></p>
        <hr />
        <button className="googleAuth" type="button"
          onClick={handleGoogleSignup}>Sign In with Google <FcGoogle className="googleIcon" /> </button>
      </section>
    </div>
  )
}
