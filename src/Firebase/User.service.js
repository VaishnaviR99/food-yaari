import { 
    db, 
    doc, 
    updateDoc, 
    getDoc 
  } from './firebaseConfig';
  
  export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error('User not found');
    }
  };
  
  export const updateUserProfile = async (userId, profileData) => {
    const userRef = doc(db, 'users', userId);
    
    try {
      await updateDoc(userRef, profileData);
      return true;
    } catch (error) {
      console.error("Profile Update Error", error);
      throw error;
    }
  };