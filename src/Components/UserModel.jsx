import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Example icon

const UserAccountModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/myposts">My Posts</Link></li>
        <li><Link to="/create">Create</Link></li>
        <li><Link to="/requests">Requests</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>
        <li onClick={onClose}>Logout</li> 
      </ul>
    </div>
  );
};

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccountClick = () => {
    setIsModalOpen(true);
  };

  return (
    <nav>
      {/* ... other navbar elements ... */}
      <button onClick={handleAccountClick}>
        <FaUserCircle /> 
      </button>
      <UserAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> 
    </nav>
  );
};