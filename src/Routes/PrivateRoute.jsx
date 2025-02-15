
import {  useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


export const PrivateRoute  = ({children}) => {
   
    const[user,setUser]=useState({});
    const navigate= useNavigate();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userData"));
      setUser(user);

  }, [user.uid]);

  if (!user) {
    navigate("/login");
  }

  return (<>{children  }</>)

};



