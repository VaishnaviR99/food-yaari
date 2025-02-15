import { 
    db, 
    storage,
    addDoc, 
    collection, 
    doc, 
    updateDoc, 
    deleteDoc,
    ref,
    uploadBytes,
    getDownloadURL
  } from './firebaseConfig';
  
  export const uploadPostImage = async (file) => {
    const storageRef = ref(storage, `post_images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };
  
  export const createPostRequest = async (userId, postData) => {
    try {
      // Add post request to user's document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        postRequests: arrayUnion({
          ...postData,
          status: 'pending',
          createdAt: new Date(),
          id: Date.now().toString()
        })
      });
  
      return true;
    } catch (error) {
      console.error("Create Post Request Error", error);
      throw error;
    }
  };
  
  export const processPostRequest = async (userId, postRequestId, action) => {
    const userRef = doc(db, 'users', userId);
    const userData = await getDoc(userRef);
    const postRequests = userData.data().postRequests;
  
    const updatedPostRequests = postRequests.map(request => 
      request.id === postRequestId 
        ? { ...request, status: action }
        : request
    );
  
    // If approved, add to posts collection
    if (action === 'approved') {
      const approvedPost = postRequests.find(r => r.id === postRequestId);
      await addDoc(collection(db, 'posts'), {
        ...approvedPost,
        status: 'published',
        publishedAt: new Date()
      });
    }
  
    await updateDoc(userRef, { postRequests: updatedPostRequests });
  };
  
  export const managePosts = {
    create: async (postData) => {
      return await addDoc(collection(db, 'posts'), postData);
    },
    update: async (postId, updatedData) => {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, updatedData);
    },
    delete: async (postId) => {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
    }
  };
  
  export const manageCategories = {
    create: async (categoryData) => {
      return await addDoc(collection(db, 'categories'), categoryData);
    },
    update: async (categoryId, updatedData) => {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, updatedData);
    },
    delete: async (categoryId) => {
      const categoryRef = doc(db, 'categories', categoryId);
      await deleteDoc(categoryRef);
    }
  };