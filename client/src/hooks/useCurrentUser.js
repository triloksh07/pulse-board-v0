import { useAuthStore } from "../store/authStore";

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  return { user, ready };
}
