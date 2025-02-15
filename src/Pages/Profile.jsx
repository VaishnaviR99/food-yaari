import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db,auth } from "../Firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "../Styles/Dashboard.css";
import { RiImageEditFill } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeImageType, setActiveImageType] = useState(null); 
  const[imageUrl,setImageUrl]=useState({profileImg:"",coverImg:""});
  const [loading, setLoading] = useState(true); // Add loading state
  const [phoneVerification, setPhoneVerification] = useState({
    phoneNumber: "",
    verificationCode: "",
    verificationId: "",
    isVerified: false,
    showOTPInput: false
  });

  const user = JSON.parse(localStorage.getItem("userData"));


  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            setUserData(data);
            setImageUrl({
              coverImg: data.coverImg || null,
              profileImg: data.profileImg || null
            });
            
          } 
           else {
            toast.error("User profile not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load profile data. Please try again later.");
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); // Set loading to false if no user
        toast.error("No user data found. Please login again.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [user?.uid]); 

  if (!user) {
    navigate("/login");
    return null; 
  }

  if (loading) {
    return <div>Loading...</div>; 
  }

  const handleEditClick = (imageType) => {
    console.log("edit")
    setActiveImageType(imageType);
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        
        const imageDataUrl = reader.result;
        
        setUserData(prev => ({ 
          ...prev,
          [activeImageType]: imageDataUrl
        }));
        setShowModal(false);
      };
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(prev=>({...prev, [activeImageType]:previewUrl}));
      console.log(imageUrl)
      reader.readAsDataURL(file);
    }
  };
 

   const handleInputChange = (e) => {
 const { name, value } = e.target;
     setUserData(prev => ({
     ...prev,
     [name]: value
     }));
  };
  const handleSave = async () => {
    
    try {
      await updateDoc(doc(db, "users", user.uid), userData); 
      setUserData(userData); 
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

 
  return (
    // <div id="profile">
    //    <ToastContainer position="top-right" autoClose={3000} />
    //   <h2>Profile Settings</h2>
    //   <div className="coverEdit">
    //     <img
    //       src={imageUrl?.coverImg}
    //       alt="coverimg"
    //     />
    //     <RiImageEditFill 
    //       className="editPen" 
    //       onClick={() => handleEditClick('coverImg')} 
    //     />
    //   </div>
    //   <div className="profileImg">
    //     <img
    //       src={imageUrl?.profileImg}
    //       alt="profileimg"
    //     />
    //     <RiImageEditFill 
    //       className="editPen" 
    //       onClick={() => handleEditClick('profileImg')} 
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="">Name</label>
    //     <input
    //       type="text"
    //       name="username" 
    //       value={userData?.username || ""} 
    //       onChange={handleInputChange} />
    //   </div>

    //   <div>
    //     <label htmlFor="">Bio</label>
    //     <span>(This will show up in the author page.)</span>
    //     <textarea
    //     name="bio"
    //       value={userData?.bio || ""} 
    //       onChange={handleInputChange}  />
    //   </div>
    //   <div>
    //     <label htmlFor="">Email</label>
    //     <input
    //       type="email"
    //       name="email" 
    //       value={userData?.email || ""} 
    //       onChange={handleInputChange} 
    //       readOnly={true}
    //     />
    //   </div>

    //   <button onClick={handleSave}>Update Profile</button>

    //   {showModal && (
    //     <div className="modal-overlay">
    //       <div className="modal-content">
    //         <div className="modal-header">
    //           <h3>Upload {activeImageType === 'profileImg' ? 'profileImg' : 'coverImg'} Image</h3>
    //           <button 
    //             className="close-button"
    //             onClick={() => setShowModal(false)}
    //           >
    //             ×
    //           </button>
    //         </div>
    //         <div className="modal-body">
    //           <input
    //             type="file"
    //             accept="image/*"
    //             onChange={handleImageUpload}
    //             className="file-input"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div id="profile">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Profile Settings</h2>
      
      <div className="coverEdit">
        <img src={imageUrl?.coverImg} alt="coverimg" />
        <RiImageEditFill className="editPen" onClick={() => handleEditClick('coverImg')} />
      </div>
      
      <div className="profileImg">
        <img src={imageUrl?.profileImg} alt="profileimg" />
        <RiImageEditFill className="editPen" onClick={() => handleEditClick('profileImg')} />
      </div>

      <div className="form-group">
        <div className="name-group">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="username"
              value={userData?.username|| ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData?.lastName || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userData?.dateOfBirth || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Bio</label>
          <span>(This will show up in the author page.)</span>
          <textarea
            name="bio"
            value={userData?.bio || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData?.email || ""}
            onChange={handleInputChange}
            readOnly={true}
          />
        </div>

       

        <div>
          <label>LinkedIn Profile</label>
          <input
            type="url"
            name="linkedinUrl"
            value={userData?.linkedinUrl || ""}
            onChange={handleInputChange}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </div>
      </div>

      <button className="saveBtn" onClick={handleSave}>Update Profile</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload {activeImageType === 'profileImg' ? 'Profile' : 'Cover'} Image</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};