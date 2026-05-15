import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { useAuthStore } from "../store/authStore.js";

export function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser().catch(console.error);
  }, [loadUser]);

  return <RouterProvider router={router} />;
}
