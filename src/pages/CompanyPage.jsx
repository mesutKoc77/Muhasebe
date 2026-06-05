import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { USER_ROLES } from "../services/storeService";

const moduleButtons = ["Günlük Ciro", "Masraflar", "Mal Alımları", "Aylık Rapor"];

const canAccessStore = (userData, storeId) => {
  if (!userData || !storeId) {
    return false;
  }

  if (userData.role === USER_ROLES.ADMIN) {
    return true;
  }

  if (userData.role === USER_ROLES.MANAGER) {
    return userData.storeId === storeId;
  }

  return false;
};

const isWithIthalatStore = (store, storeId) => {
  const storeName = store?.name || store?.title || store?.companyName || "";
  const normalizedName = storeName.toLocaleLowerCase("tr-TR").replace(/\s/g, "");

  return (
    storeId === "withithalat" ||
    normalizedName.includes("withithalat") ||
    normalizedName.includes("withoithalat")
  );
};

export default function CompanyPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let redirectTimer;

    const redirectToDashboard = () => {
      redirectTimer = setTimeout(() => navigate("/dashboard"), 1500);
    };

    const fetchCompanyData = async () => {
      setIsLoading(true);
      setError("");
      setStore(null);

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate("/");
          return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError("Bu firmaya erişim yetkiniz yok.");
          redirectToDashboard();
          return;
        }

        const userData = userSnap.data();

        if (!canAccessStore(userData, storeId)) {
          setError("Bu firmaya erişim yetkiniz yok.");
          redirectToDashboard();
          return;
        }

        const storeRef = doc(db, "stores", storeId);
        const storeSnap = await getDoc(storeRef);

        if (!storeSnap.exists()) {
          setError("Firma bulunamadı.");
          return;
        }

        setStore({ id: storeSnap.id, ...storeSnap.data() });
      } catch {
        setError("Firma bulunamadı.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();

    return () => clearTimeout(redirectTimer);
  }, [navigate, storeId]);

  const storeName = store?.name || store?.title || store?.companyName || store?.id;
  const visibleModules = isWithIthalatStore(store, storeId)
    ? [...moduleButtons, "Stok Yönetimi"]
    : moduleButtons;

  return (
    <div style={{ padding: "30px" }}>
      <button type="button" onClick={() => navigate("/dashboard")}>
        Dashboard'a Dön
      </button>

      <hr />

      {isLoading && <p>Firma yükleniyor...</p>}

      {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && store && (
        <div>
          <h1>{storeName}</h1>

          <h2>Modüller</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "220px" }}>
            {visibleModules.map((moduleName) => (
              <button key={moduleName} type="button">
                {moduleName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
