import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "./LoadingPage";
import { AuthContext } from "../../Contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [formData, setFormData] = useState({ displayName: "" });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch profile
  const fetchProfile = async () => {
    if (!authUser?.email) return;
    try {
      const res = await axiosSecure.get(`/profile?email=${authUser.email}`);
      setUser(res.data);
      setFormData({ displayName: res.data.displayName || "" });
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authUser]);

  // Check Stripe subscription success redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      const confirmSubscription = async () => {
        try {
          const res = await axiosSecure.get(
            `/subscribe-success?session_id=${sessionId}`
          );
          setUser((prev) => ({ ...prev, isPremium: true }));
          alert("Subscription successful! You are now a Premium member.");
          navigate("/profile", { replace: true });
        } catch (err) {
          console.error("Confirm subscription error:", err);
          alert("Subscription confirmation failed. Please try again.");
        }
      };
      confirmSubscription();
    }
  }, [searchParams, navigate, axiosSecure]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (user?.isBlocked) {
      alert("Your account is blocked. Cannot update profile.");
      return;
    }

    setUpdating(true);
    try {
      const res = await axiosSecure.patch("/profile", {
        displayName: formData.displayName,
      });
      setUser(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubscribe = async () => {
    if (user?.isBlocked) {
      alert("Your account is blocked. Cannot subscribe.");
      return;
    }

    setSubscribing(true);
    try {
      const res = await axiosSecure.post("/subscribe", {});
      if (!res.data?.url) {
        console.error("Backend did not return a URL:", res.data);
        alert("Subscription failed. Invalid server response.");
        return;
      }
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Subscription failed:", err);
      alert("Subscription failed. Check the console for details.");
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingPage />
      </div>
    );
  }

  if (!user)
    return <p className="py-20 text-center text-red-500">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-26 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-lg object-cover border-4 border-white"
        />
        <h1 className="text-3xl font-bold mt-4">{user.displayName}</h1>
        <p className="text-gray-500">{user.email}</p>

        {user.isPremium && (
          <div className="mt-3 px-4 py-1 rounded-full bg-yellow-400 text-white text-sm font-semibold shadow-md">
            ⭐ Premium Member
          </div>
        )}

        {user.isBlocked && (
          <div className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg border border-red-200">
            Your account is blocked. Contact support.
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 font-medium">Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={user.isBlocked}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updating || user.isBlocked}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all ${
            user.isBlocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {updating ? "Updating..." : "Save Changes"}
        </button>

        {!user.isPremium && !user.isBlocked && (
          <div className="mt-10 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900">
              Upgrade to Premium ✨
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              Unlock unlimited issue submissions + exclusive features.
            </p>
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow hover:opacity-90 transition-all"
            >
              {subscribing ? "Processing..." : "Upgrade for 1000৳"}
            </button>
          </div>
        )}

        {user.isPremium && (
          <p className="mt-6 text-center text-green-600 text-sm font-medium">
            You are a premium user — enjoy unlimited access! ✔
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
