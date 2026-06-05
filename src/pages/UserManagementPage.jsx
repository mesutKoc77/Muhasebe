import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/authContext";
import { USER_ROLES } from "../services/storeService";

const usersCollection = collection(db, "users");

const mapUserDocument = (userDoc) => ({
  id: userDoc.id,
  ...userDoc.data(),
});

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { currentUserProfile, profileLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = currentUserProfile?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    if (!isAdmin) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const usersSnapshot = await getDocs(usersCollection);
        setUsers(usersSnapshot.docs.map(mapUserDocument));
      } catch {
        setError("Kullanıcılar yüklenemedi.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, navigate, profileLoading]);

  const showLoading = profileLoading || isLoading;

  return (
    <div style={{ padding: "30px" }}>
      <button type="button" onClick={() => navigate("/dashboard")}>
        Dashboard'a Dön
      </button>

      <hr />

      <h1>Kullanıcı Yönetimi</h1>

      {showLoading && <p>Kullanıcılar yükleniyor...</p>}

      {!showLoading && error && <p style={{ color: "red" }}>{error}</p>}

      {!showLoading && !error && users.length === 0 && <p>Listelenecek kullanıcı bulunamadı.</p>}

      {!showLoading && !error && users.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{ border: "1px solid #ddd", marginBottom: "12px", padding: "12px" }}
            >
              <p>
                <strong>name:</strong> {user.name || "-"}
              </p>
              <p>
                <strong>email:</strong> {user.email || "-"}
              </p>
              <p>
                <strong>role:</strong> {user.role || "-"}
              </p>
              <p>
                <strong>storeId:</strong> {user.storeId || "-"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
