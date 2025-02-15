import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseConfig";
import { PostCard } from "../Components/PostCard";
import { FaRegNewspaper } from "react-icons/fa";
import { FaBlog } from "react-icons/fa6";
import { FaBorderAll } from "react-icons/fa6";
import { GrLinkedin } from "react-icons/gr";
import "../Styles/NewsBlog.css";

export const AuthorPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchAuthorData();
    fetchAuthorPosts();
  }, [id, selectedType]);

  const fetchAuthorData = async () => {
    // const usersquery= query(collection(db, "users"));
    // const querySnapshot = await getDocs(usersquery);
    // const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id,...doc.data() }));
    // console.log(usersData[0].id);

    try {
      const authorDoc = doc(db, "users", id); // Fetch author by userId
      const authorSnapshot = await getDoc(authorDoc);
      if (authorSnapshot.exists()) {
        setAuthor(authorSnapshot.data());
        console.log(author);
      } else {
        console.error("Author not found");
      }
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
  };

  const fetchAuthorPosts = async () => {
    try {
      let postsQuery;
      if (selectedType === "all") {
        postsQuery = query(collection(db, "posts"), where("userId", "==", id));
      } else {
        postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", id),
          where("postType", "==", selectedType)
        );
      }
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching author posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const activeButtonRef = useRef(null);

  const setActiveButton = (button) => {
    if (activeButtonRef.current) {
      activeButtonRef.current.classList.remove("active");
    }
    button.classList.add("active");
    activeButtonRef.current = button;
  };

  if (loading) return <div>Loading...</div>;
  if (!author) return <div>Author not found</div>;

  return (
    <div id="authorContainer">
      <div className="authorData">
        <img src={author.coverImg} alt="coverimage" className="coverImg" />
        <div className="authorInfo">
          <img
            src={author.profileImg}
            alt="profileImg"
            className="profileImgg"
          />
          <div className="authorBio">
            <h2>{author.username}</h2>
            <p>{author.bio}</p>
          </div>
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="linkedIn"
            >
              <GrLinkedin />
            </a>
        </div>
      </div>
      <div className="post-filter">
        <button
          className={`post-filter-btn ${
            selectedType === "all" ? "active" : ""
          }`}
          onClick={(e) => {
            handleTypeClick("all");
            setActiveButton(e.target);
          }}
          ref={activeButtonRef}
        >
          <FaBorderAll className="filtericon" />
          All Posts
        </button>
        <button
          className={`post-filter-btn ${
            selectedType === "blog" ? "active" : ""
          }`}
          onClick={(e) => {
            handleTypeClick("blog");
            setActiveButton(e.target);
          }}
        >
          <FaBlog className="filtericon" />
          Blogs
        </button>
        <button
          className={`post-filter-btn ${
            selectedType === "news" ? "active" : ""
          }`}
          onClick={(e) => {
            handleTypeClick("news");
            setActiveButton(e.target);
          }}
        >
          <FaRegNewspaper className="filtericon" />
          News
        </button>
      </div>

      <div className="postConatiner" id="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
