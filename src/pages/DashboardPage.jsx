import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { getStoresForUser } from "../services/storeService";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate("/");
          return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError("Kullanıcı bilgileri bulunamadı.");
          setUserData(null);
          setStores([]);
          return;
        }

        const currentUserData = userSnap.data();
        const userStores = await getStoresForUser(currentUserData);

        setUserData(currentUserData);
        setStores(userStores);
      } catch {
        setError("Dashboard verileri yüklenirken bir hata oluştu.");
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Pazar Muhasebe Paneli</h1>

      {userData && (
        <div>
          <p>Hoş geldin: {userData.name}</p>
          <p>Rol: {userData.role}</p>
          <p>Yetki: {userData.storeId || "Tüm firmalar"}</p>
        </div>
      )}

      <button onClick={handleLogout}>Çıkış Yap</button>

      <hr />

      <h2>Firma Seçiniz</h2>

      {isLoading && <p>Firmalar yükleniyor...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && stores.length === 0 && (
        <p>Görüntülenecek aktif firma bulunamadı.</p>
      )}

      {!isLoading && !error && stores.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {stores.map((store) => (
            <li key={store.id} style={{ marginBottom: "12px" }}>
              <button type="button">
                {store.name || store.title || store.companyName || store.id}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
