import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Test from "../Home/Test";
import SocialLogin from "./SocialLogin";

const Register = () => {
  const { registerUser, updateUserProfile } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

  const handleRegistration = (data) => {
    console.log(data);

    const profileImg = data.photo[0];

    registerUser(data.email, data.password)
      .then(async () => {
        const formData = new FormData();
        formData.append("image", profileImg);

        const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${
          import.meta.env.VITE_IMAGE_HOST_KEY
        }`;

        const imgUpload = await axios.post(image_API_URL, formData);
        const photoURL = imgUpload.data.data.url;

        const userProfile = {
          displayName: data.name,
          photoURL,
        };

        await updateUserProfile(userProfile);

        console.log("User profile updated");

        
        const auth = getAuth();
        await auth.currentUser.getIdToken(true);

      
        const userInfo = {
          email: data.email,
          displayName: data.name,
          photoURL,
        };

        const res = await axiosSecure.post("/users", userInfo);

        console.log("Saved in DB:", res.data);

        navigate(location.state || "/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col md:flex-col-reverse lg:flex-row min-h-[80vh] items-center justify-center gap-8 px-4 lg:px-20 py-10">
      {/* Form Section */}
      <div className="mt-15 w-full lg:w-1/2 max-w-lg">
        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Register to CivicConnect
          </h2>
          <p className="text-2xl font-bold text-green-700">Be a good citizen</p>

          {/* name field */}
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input input-bordered w-full"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500">Name is required</p>}
          {/* file field */}
          <label className="label mt-3">Profile Photo</label>
          <input
            type="file"
            {...register("photo", { required: true })}
            className="file-input w-full"
            accept="image/*"
          />
          {errors.photo && <p className="text-red-500">Photo is required</p>}
          {/* email field */}
          <label className="label mt-3">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}
          {/* password field */}
          <div className="w-full">
            <label className="label mt-3">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                })}
                className="input input-bordered w-full pr-10"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-500 z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Minimum 6 characters</p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="text-red-500">
                Must include uppercase, lowercase, number, and special
                character.
              </p>
            )}
          </div>
          {errors.password && (
            <p className="text-red-500">
              Password must be at least 6 characters, include uppercase,
              lowercase, number, and special character.
            </p>
          )}

          <button className="btn btn-primary w-full mt-4 text-white">
            Register
          </button>
        </form>
        <SocialLogin></SocialLogin>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="text-primary font-semibold"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center gap-4">
        <img
          src={logo}
          alt="CivicConnect"
          className="w-full max-w-md object-contain"
        />
      </div>
      
    </div>
    
  );
};

export default Register;
