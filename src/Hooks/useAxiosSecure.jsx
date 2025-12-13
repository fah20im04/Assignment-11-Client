import axios from "axios";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

// ✅ REQUEST INTERCEPTOR — ALWAYS ATTACHED
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    // 🔥 Sync Firebase token → localStorage
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        localStorage.setItem("accessToken", token);
        console.log("🔥 Firebase token saved");
      } else {
        localStorage.removeItem("accessToken");
      }
    });

    // 🔥 RESPONSE INTERCEPTOR
    const interceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      unsubscribe();
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
