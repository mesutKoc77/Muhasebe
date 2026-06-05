import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Pazar Muhasebe Paneli</h1>

      {userData && (
        <div>
          <p>Hoş geldin: {userData.name}</p>
          <p>Rol: {userData.role}</p>
          <p>Yetki: {userData.storeId}</p>
        </div>
      )}

      <button onClick={handleLogout}>Çıkış Yap</button>

      <hr />

      <h2>Firma Seçiniz</h2>

      <button>Koç Home Concept</button>
      <br />
      <br />

      <button>Pazar Yeri</button>
      <br />
      <br />

      <button>Withithalat</button>
    </div>
  );
}