import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase/firebaseConfig'; 
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import "../Styles/Dashboard.css"

export const MyPosts = () => {
  const navigate = useNavigate();
 
  const [posts, setPosts] = useState([]);
  const [noData, setNoData] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user && user?.uid) {
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
        if (fetchedPosts.length === 0) { 
          setNoData(true);
        }
      }
    };
    
    if (user) {
      fetchUserPosts();
    }
  }, []);
  console.log(posts)

  if (!user) {
    navigate('/login');
    return null; 
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div id='myPosts'>
      <h2>My Posts</h2>
      <div className='myPostContainer'>
        {noData ? ( 
          <p className="empty">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className='myPostCard'
              onClick={() => { navigate(`/post/${post.id}`) }}
            >
              <img src={post.thumbnail} alt="thumbnail" />
              <div className='postData'>
                <p className='postTitle'>{post.title}</p>
                <p className='postDate'>{formatDate(post.date)}</p>
                <p className='category'>{post.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;