import { 
    auth, 
    db, 
    googleProvider, 
    facebookProvider,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs
  } from './firebaseConfig';
  
  export const signUpWithEmail = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if this is the first user (make them admin)
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      
      const userType = usersSnapshot.empty ? 'admin' : 'user';
  
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        type: userType,
        ...userData,
        posts: [],
        postRequests: []
      });
  
      return user;
    } catch (error) {
      console.error("Signup Error", error);
      throw error;
    }
  };
  
  export const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login Error", error);
      throw error;
    }
  };
  
  export const socialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if user already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          type: 'user',
          profilePicture: user.photoURL,
          posts: [],
          postRequests: []
        });
      }
  
      return user;
    } catch (error) {
      console.error("Social Login Error", error);
      throw error;
    }
  };
  
  export const googleLogin = () => socialLogin(googleProvider);
  export const facebookLogin = () => socialLogin(facebookProvider);