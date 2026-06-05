import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../contexts/authContext";
import { getStoresForUser } from "../services/storeService";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, currentUserProfile, profileLoading } = useAuth();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (profileLoading) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        if (!currentUser) {
          navigate("/");
          return;
        }

        if (!currentUserProfile) {
          setStores([]);
          return;
        }

        const userStores = await getStoresForUser(currentUserProfile);
        setStores(userStores);
      } catch {
        setError("Dashboard verileri yüklenirken bir hata oluştu.");
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, currentUserProfile, navigate, profileLoading]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Pazar Muhasebe Paneli</h1>

      {currentUserProfile && (
        <div>
          {currentUserProfile.name && <p>Hoş geldin: {currentUserProfile.name}</p>}
          <p>Role: {currentUserProfile.role}</p>
          <p>Store: {currentUserProfile.storeId || "all"}</p>
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
              <button type="button" onClick={() => navigate(`/company/${store.id}`)}>
                {store.name || store.title || store.companyName || store.id}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
