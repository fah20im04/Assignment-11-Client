import axios from "axios";
import { useEffect } from "react";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    // 🔥 When Firebase refreshes token → save new token in localStorage
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);

        localStorage.setItem("accessToken", token);

        console.log("🔥 Firebase token saved to localStorage");
      } else {
        console.log("🧹 Clearing token (user logged out)");
        localStorage.removeItem("accessToken");
      }
    });

    // 🔥 Interceptor: Attach token to every secure request
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 🔥 Handle unauthorized errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          logOut().then(() => navigate("/login"));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      unsubscribe();
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
