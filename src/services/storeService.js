import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const storesCollection = collection(db, "stores");

const mapStoreDocument = (storeDoc) => ({
  id: storeDoc.id,
  ...storeDoc.data(),
});

export const getActiveStores = async () => {
  const activeStoresQuery = query(storesCollection, where("active", "==", true));
  const querySnapshot = await getDocs(activeStoresQuery);

  return querySnapshot.docs.map(mapStoreDocument);
};

export const getActiveStoreById = async (storeId) => {
  if (!storeId) {
    return [];
  }

  const storeRef = doc(db, "stores", storeId);
  const storeSnapshot = await getDoc(storeRef);

  if (!storeSnapshot.exists()) {
    return [];
  }

  const store = mapStoreDocument(storeSnapshot);

  return store.active === true ? [store] : [];
};

export const getStoresForUser = async (userData) => {
  if (!userData) {
    return [];
  }

  if (userData.role === USER_ROLES.ADMIN) {
    return getActiveStores();
  }

  if (userData.role === USER_ROLES.MANAGER) {
    return getActiveStoreById(userData.storeId);
  }

  return [];
};
