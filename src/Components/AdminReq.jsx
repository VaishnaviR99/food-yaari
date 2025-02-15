import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { TextEditor } from "./TextEditor";
import "draft-js/dist/Draft.css";
import "../Styles/Dashboard.css";

export const AdminRequests = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [editedRequestData, setEditedRequestData] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailBase64, setThumbnailBase64] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user && user.uid) {
        try {
          const requestsQuery = query(collection(db, "requests")); // Get all requests
          const querySnapshot = await getDocs(requestsQuery);
          const fetchedRequests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(fetchedRequests);
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
  }, [user?.uid]);
  console.log(requests);
  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <div>Loading requests...</div>;
  }

  const handleCardClick = (request) => {
    setSelectedRequest(request);
    setEditedRequestData({ ...request });
    setPreviewURL(request.thumbnail);
    setThumbnailBase64(request.thumbnail);

    if (request.content) {
      try {
        const contentState = convertFromRaw(JSON.parse(request.content));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error converting from raw:", error);
        setEditorState(EditorState.createEmpty());
      }
    } else {
      setEditorState(EditorState.createEmpty());
    }
  };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setEditedRequestData((prev) => ({
      ...prev,
      content: JSON.stringify(rawContent),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = async () => {
    try {
      await updateDoc(doc(db, "requests", selectedRequest.id), {
        ...editedRequestData,
        status: "active",
        thumbnail: thumbnailBase64, // Store base64
      });

      await addDoc(collection(db, "posts"), {
        ...editedRequestData,
        status: "active",
        thumbnail: thumbnailBase64, // Store base64
        reqCreated: new Date(),
      });
      await updateDoc(doc(db, "requests", selectedRequest.id), {
        ...editedRequestData,
        status: "active",
        thumbnail: thumbnailBase64,
      });
      await addDoc(collection(db, "posts"), {
        ...editedRequestData,
        status: "active",
        thumbnail: thumbnailBase64,
        reqCreated: new Date(),
      }); // Add to posts collection
      setRequests(requests.filter((req) => req.id !== selectedRequest.id)); // Remove request from the list
      setSelectedRequest(null);
      alert("Request approved and added to posts!");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error approving request. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      await updateDoc(doc(db, "requests", selectedRequest.id), {
        status: "rejected",
      });
      setRequests(requests.filter((req) => req.id !== selectedRequest.id));
      setSelectedRequest(null);
      alert("Request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Error rejecting request. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedRequest(null);
    setThumbnail(null);
    setPreviewURL(null);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
        setThumbnailBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
      setThumbnailBase64(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div id="admin-requests-container">
      <h2>Requests</h2>
      <div className="requests-grid">
        {requests.map((request) => (
          <div
            key={request.id}
            className="request-card"
            onClick={() => handleCardClick(request)}
          >
            <img
              src={request.thumbnail}
              alt="thumbnail"
              className="request-thumbnail"
            />
            <div className="request-details">
              <p className="request-title">{request.title}</p>
              <p className="request-date">{formatDate(request.reqCreated)}</p>
              <p className={`request-status${request.status}`}>
                {request.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="request-details-container">
          <div className="request-details-content">
            <div className="request-data">
              <div>
                <label htmlFor="category">Author</label>
                <p> {selectedRequest?.author}</p>
              </div>
              <p>{formatDate(selectedRequest.reqCreated)}</p>
              <p>{selectedRequest.status}</p>
              <div>
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editedRequestData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="category">Post</label>
                <input
                  type="text"
                  name="postType"
                  value={editedRequestData.postType}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* <input type="file" name="thumbnail" onChange={handleThumbnailChange} /> */}
            {previewURL && (
              <img
                src={previewURL}
                alt="Thumbnail Preview"
                className="requestImg"
              />
            )}
            {editorState && ( // Conditionally render the editor
              <TextEditor
                setPostContent={(content) =>
                  setEditedRequestData((prev) => ({ ...prev, content }))
                }
                initialContent={selectedRequest.body} // Pass initial content
              />
            )}

            <button onClick={handleApprove}>Approve</button>
            <button onClick={handleReject}>Reject</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
