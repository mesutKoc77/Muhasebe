import { createContext, useContext } from "react";

export const AuthContext = createContext({
  currentUser: null,
  currentUserProfile: null,
  loading: true,
  profileLoading: false,
});

export function useAuth() {
  return useContext(AuthContext);
}
