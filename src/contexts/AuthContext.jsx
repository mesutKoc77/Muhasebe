import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let authStateVersion = 0;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentAuthStateVersion = authStateVersion + 1;
      authStateVersion = currentAuthStateVersion;

      if (!isMounted) {
        return;
      }

      setCurrentUser(user);
      setCurrentUserProfile(null);
      setLoading(false);

      if (!user) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        const userProfileRef = doc(db, "users", user.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (!isMounted || currentAuthStateVersion !== authStateVersion) {
          return;
        }

        if (userProfileSnap.exists()) {
          setCurrentUserProfile({ id: userProfileSnap.id, ...userProfileSnap.data() });
        } else {
          setCurrentUserProfile(null);
        }
      } catch {
        if (isMounted && currentAuthStateVersion === authStateVersion) {
          setCurrentUserProfile(null);
        }
      } finally {
        if (isMounted && currentAuthStateVersion === authStateVersion) {
          setProfileLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, currentUserProfile, loading, profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
