import react, { useState, useEffect, useParams } from 'react';
import {Navbar} from '../Components/Navbar'
import { useLocation } from "react-router-dom";

export const LandingPage = () => {
 
    const location = useLocation();
    const user = location.state?.user;
  
    return (
      <div>
        
        <h1>Welcome, </h1>
      </div>
    );
  };
