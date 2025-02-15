import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import { collection, getDocs, query, where,doc, getDoc } from "firebase/firestore";
import "../Styles/Dashboard.css";
import AdminRequests from "../Components/AdminReq";

export const Requests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeduser, setStoredUser] = useState(null); // Store user in state
  const [isAdmin, setIsAdmin] = useState(false);
  const [noData, setNoData] = useState(false); 

  const user = JSON.parse(localStorage.getItem("userData"));
  useEffect(() => {
    setStoredUser(user);
    const fetchRequests = async () => {
      if (user && user.uid) {
        try {

         const userDocRef = doc(db, "users", user.uid);
                  const userDocSnapshot = await getDoc(userDocRef);
        
                  if (userDocSnapshot.exists()) {
                    const data = userDocSnapshot.data();
                    
              console.log(data.userType)
              setIsAdmin(data.userType === "admin");
          }

          const requestsQuery = query(
            collection(db, "requests"),
            where("userId", "==", user.uid)
          );

          const querySnapshot = await getDocs(requestsQuery);
          const fetchedRequests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(fetchedRequests);
          if (fetchedRequests.length === 0) { 
            setNoData(true); // If no data, set noData to true
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };

    fetchRequests();
  }, []); 

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div>Loading requests...</div>;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ""; 
    const date = new Date(timestamp.seconds * 1000);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      {!isAdmin ? (
        <div id="requests-container">
          <h1>My Requests</h1>
          <div className="dashboard-header">
            <div className="dashboard-column">Post</div>
            <div className="dashboard-column">Date</div>
            <div className="dashboard-column">Status</div>
          </div>
  
          <div className="requests-grid">
            {noData ? (
              <p className="empty">No requests found.</p>
            ) : ( 
              requests.map((request) => (
                <div key={request.id} className="request-card">
                  <img
                    src={request.thumbnail}
                    alt="thumbnail"
                    className="request-thumbnail"
                  />
                  <div className="request-details">
                    <h2 className="request-title">{request.title}</h2>
                    <p className="request-date">
                      {formatDate(request.reqCreated)}
                    </p>
                    <p className="request-status"> {request.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <AdminRequests />
      )}
    </>
  );
}

export default Requests;
