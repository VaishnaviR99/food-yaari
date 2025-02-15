import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import "../Styles/Dashboard.css";
import {SideBar} from '../Components/SideBar'

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);
      fetchUserPosts(storedUser.uid);
      fetchUserRequests(storedUser.uid);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchUserPosts = async (userId) => {
    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId)
    );
    const postsSnapshot = await getDocs(postsQuery);
    const postsData = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsData);
  };

  const fetchUserRequests = async (userId) => {
    const requestsQuery = query(
      collection(db, "requests"),
      where("userId", "==", userId)
    );
    const requestsSnapshot = await getDocs(requestsQuery);
    const requestsData = requestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRequests(requestsData);
  };

  const handleCreatePost = async () => {
    try {
      await addDoc(collection(db, "posts"), {
        title: newPostTitle,
        content: newPostContent,
        userId: user.id,
        createdAt: new Date(),
      });

      await addDoc(collection(db, "requests"), {
        title: newPostTitle,
        content: newPostContent,
        userId: user.id,
        status: "pending",
        createdAt: new Date(),
      });

      setNewPostTitle("");
      setNewPostContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div id="user-dashboard">
    <SideBar/>
      <section id="content">
        
        </section>
    </div>
  );
};
