import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate(location?.state || "/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col md:flex-col-reverse lg:flex-row min-h-[80vh] items-center justify-center gap-8 px-4 lg:px-20 py-10">
      <div className="mt-15 w-full lg:w-1/2 max-w-lg">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Login to CivicConnect
          </h2>
          <p className="text-2xl font-bold text-green-700">Welcome back!</p>

          {/* Email */}
          <label className="label mt-3">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}

          {/* Password */}
          <div className="w-full">
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
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
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
              <p className="text-red-500">Password is required</p>
            )}
          </div>

          <button className="btn btn-primary w-full mt-4 text-white">
            Login
          </button>
        </form>
        <SocialLogin></SocialLogin>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={location.state}
            className="text-primary font-semibold"
          >
            Register
          </Link>
        </p>
        
      </div>
    </div>
  );
};

export default Login;
