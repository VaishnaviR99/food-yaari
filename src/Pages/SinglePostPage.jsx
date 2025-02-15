import react, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import ContentRenderer, {contentRenderer} from "../Components/ContentRenderer"
import { db, auth } from "../Firebase/firebaseConfig";
export const SinglePostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchAuthorData();
  }, [id]);

  const fetchPost = async () => {
    try {
      const postDocRef = doc(db, "posts", id);
      const postDoc = await getDoc(postDocRef);
      if (postDoc.exists()) {
        setPost(postDoc.data());
        console.log(postDoc.data());
        fetchAuthorData(postDoc.data().userId);
      } else {
        console.error("Post not found.");
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorData = async (userId) => {
    try {
      const authorDoc = doc(db, "users", userId);
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
  if (author) {
    console.log(author);
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="singlePostContainer">
      <div className="singleHeader">
        <img src={post.thumbnail} alt={post.title} className="post-thumbnail" />
        <div className="text-container">
          <p className="postCategory">{post.category}</p>
          <h2 className="postTitle">{post.title}</h2>
          <hr />
          <div className="author-info">
            <img src={author?.profileImg} alt="authorProfile" />
            <div>
              <p>
                by{" "}
                <Link to={`/author/${post.userId}`} className="author-link">
                  {author?.username}
                </Link>
              </p>
              <p className="postDate">{formatDate(post.date)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="post-content-container">
        <div className="post-content"> {post.body}</div>
{/* <ContentRenderer rawContent={post.content}/> */}

        <div className="ads-container">
          <p>Advertisement</p>
        </div>
      </div>
    </div>
  );
};
