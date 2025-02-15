import react, { useState, useEffect, useParams } from "react";
import { PostCard } from "../Components/PostCard";
import "../Styles/NewsBlog.css";
import { db } from '../Firebase/firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
export const NewsBlogPage = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const newsQuery = query(collection(db, "posts"), where("postType", "==", "news"));
      const blogsQuery = query(collection(db, "posts"), where("postType", "==", "blog"));

    

      const newsSnapshot = await getDocs(newsQuery);
      const newsData = newsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsData = blogsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setFeaturedNews(newsData.slice(0, 6)); // Limit to 6 posts
      setFeaturedBlogs(blogsData.slice(0, 6));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div id="newsBlogContainer">
      <section >
        <div className="subTitle">
          <h2 >Featured News</h2>
          <button className="viewMore">View More</button>
        </div>
        <div className="postConatiner">
          {featuredNews.map((news) => (
            <PostCard key={news.id} post={news} />
          ))}
        </div>
        
      </section>

      <section >
        <div className="subTitle">
          <h2 >Featured Blogs</h2>
          <button className="viewMore">View More</button>
        </div>
        <div className="postConatiner">
          {featuredBlogs.map((blog) => (
            <PostCard key={blog.id} post={blog} />
          ))}
        </div>
      </section>
    </div>
  );
};
