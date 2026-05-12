import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useCurrentUser() {
  const { user, ready, loadUser } = useAuthStore();

  useEffect(() => {
    if (!ready) {
      loadUser();
    }
  }, [ready, loadUser]);

  return { user, ready };
}
