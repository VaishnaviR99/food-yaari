import React,{useState,useEffect} from "react";
import "../Styles/Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/Final Logo.png";
import { FaRegUser } from "react-icons/fa";


export const Navbar = () => {
  const [storedUser, setStoredUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setStoredUser(user);
  }, []);

  const handleAccountClick = () => {
    if (storedUser) {
      navigate('/dashboard/profile');
    } else {
      
      navigate("/login");
    }
  };
  return (
    <nav id="navContainer">
      
      
      <img src={logo} alt="logo" onClick={()=>navigate("/")} />
      

      <div id="navLinks">
        <NavLink to="/" >
          <p>Home</p>
        </NavLink>
        <NavLink to="/news-blogs" >
          <p>News & Blog</p>
        </NavLink>
       

        <NavLink to="/courses" >
          <p>Courses</p>
        </NavLink>

        <NavLink to="/aboutus" 
        >
          <p>About Us</p>
        </NavLink>
      </div>


      <div className="account-button" onClick={handleAccountClick}>
        {storedUser ? (
          <>
          <span title="My Account" onClick={handleAccountClick} >

          <FaRegUser id="myAccount" />
          </span>
         
               
           
            
          </>
        ) : (
          <Link to="/login">
          <button id="login">LOGIN</button>
        </Link>
        )}
      </div>
    </nav>
  );
};
