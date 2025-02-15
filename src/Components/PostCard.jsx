import { useNavigate } from "react-router-dom";
import { TbUserSquareRounded } from "react-icons/tb";
import "../Styles/NewsBlog.css";

export const PostCard = ({ post }) => {
  const navigate = useNavigate();
  // console.log(post);

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/author/${post.userId}`);
  };
  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
   
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); 
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); 
  };
  return (
    <div className="postCard" onClick={handleCardClick}>
      <img
      src={post.thumbnail}
        alt={post.title}
        className="thumbnail"
      />
      <div className="postDetails">
        <p className="postTitle">{post.title.substring(0, 45)}...</p>
        <p className="postBody">{post.body.substring(0, 75)}...</p>
        <div className="authorDetails">
          <div
            className="authorIcon"
            onClick={ handleAuthorClick}
          >
            <TbUserSquareRounded />
            <p className="authoName">{post.author}</p>
          </div>

         
             {post.postType === 'news' && (
            <p>{formatDate(post.date)}</p> 
          )}
         
        </div>
      </div>
    </div>
  );
};
