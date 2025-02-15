import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import { Editor } from "react-draft-wysiwyg"; // Import a rich text editor library
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js"; // For converting rich text to plain text
import { TextEditor } from "../Components/TextEditor";

export const CreatePost = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postType, setPostType] = useState("news"); // Default post type
  const [selectedCategory, setSelectedCategory] = useState("");
  const [postContent, setPostContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [thumbnailBase64, setThumbnailBase64] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const data = userDocSnapshot.data();
          setUserData(data);
        }

        if (categoriesSnapshot.docs.length > 0) {
          const categoryDoc = categoriesSnapshot.docs[0];
          const categoriesArray = categoryDoc.data().category;

          if (isMounted) { // Check if component is still mounted
            setCategories(categoriesArray);
          }
        } else {
          console.warn("No categories document found.");
          if (isMounted) {
            setCategories([]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => { // Cleanup function
      isMounted = false; // Set flag to false when component unmounts
      // Any other cleanup related to the editor or TextEditor
    };
  }, []);
  

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailURL(reader.result); // Preview URL
        setThumbnailBase64(reader.result); // Base64 data
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnail(null);
      setThumbnailURL(null);
      setThumbnailBase64(null);
    }
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(user);
      await addDoc(collection(db, "requests"), {
        title: postTitle,
        body: postContent,
        category: selectedCategory,
        postType: postType,
        userId: user.uid,
        status: "pending",
        reqCreated: new Date(),
        author: userData.username,
        thumbnail: thumbnailBase64, // Store base64 data in Firestore
      });

       toast.success("Post Request created successfully!");

      setPostTitle("");
      setSelectedCategory("");
      setPostType("news"); 
      setPostContent(""); 
      setThumbnail(null);
      setThumbnailURL(null);
      setThumbnailBase64(null);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post. Please try again.");
    }
  };

  return (
    <div id="createPost">
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
      <h2>Create Post</h2>
      <form onSubmit={handlePostSubmit}>
        <div>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            onChange={handleThumbnailChange}
          />
          {thumbnailURL && (
            <img
              src={thumbnailURL}
              alt="Thumbnail Preview"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((categoryName, index) => (
              <option key={index} value={categoryName}>
             
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="postType">Post Type:</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            required
          >
            <option value="news">News</option>
            <option value="blog">Blog</option>
          </select>
        </div>

        <div>
          <label htmlFor="content">Content:</label>
          <TextEditor setPostContent={setPostContent} />
          {/* Pass setPostContent */}
        </div>

        <button className="createBtn" type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
