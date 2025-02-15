import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegFolderOpen } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../Assets/Final Logo.png";
import { getAuth, signOut } from "firebase/auth";
import "../Styles/Dashboard.css";

export const SideBar = () => {
const navigate=useNavigate()
    const LogoutHandle=()=>{
      const auth = getAuth();
      signOut(auth).then(() => {
        localStorage.removeItem("userData");
        navigate("/");
      }).catch((error) => {
        console.log("Sign-out failed:", error);
      });
    }
  return (
    <section id="sidebar">
        <div className="sidelogo">
      <Link to={"/"}>
          <img src={logo} alt="logo" />
      </Link>
        </div>
      <NavLink to={"/dashboard/profile"} className="sidelinks">
        <div>
          <span>
            <FaRegUserCircle />
          </span>
          <p>Profile</p>
        </div>
      </NavLink>
      <NavLink to={"/dashboard/myposts"} className="sidelinks">
        <div>
          <span>
            <FaRegFolderOpen />
          </span>
          <p>My Posts</p>
        </div>
      </NavLink>
      <NavLink to={"/dashboard/create"} className="sidelinks">
        <div>
          <span>
            <FaRegPlusSquare />
          </span>
          <p>Create</p>
        </div>
      </NavLink>
      <NavLink to={"/dashboard/requests"} className="sidelinks">
        <div>
          <span>
            <FaRegLightbulb />
          </span>
          <p>Requests</p>
        </div>
      </NavLink>

      <div className="sidelinks" onClick={LogoutHandle}>
        <span>
          <RiLogoutCircleLine />
        </span>
        <p>Logout</p>
      </div>
    </section>
  );
};
