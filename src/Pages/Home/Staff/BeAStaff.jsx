import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const BeAStaff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const loaderData = useLoaderData(); 
  // const uploadFileToImgbb = async (file) => {
  //   if (!file) return null;

  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const res = await fetch(
  //       `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
  //       { method: "POST", body: formData }
  //     );
  //     const data = await res.json();
  //     return data.success ? data.data.url : null;
  //   } catch (err) {
  //     console.error("Imgbb upload error:", err);
  //     return null;
  //   }
  // };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const selectedRegion = watch("region");

  const districtsByRegion = (region) => {
    if (!region) return [];
    return loaderData
      .filter((item) => item.region === region)
      .map((item) => item.district);
  };

  const onSubmit = async (data) => {
    try {
      const application = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        region: data.region,
        district: data.district,
        experience: data.experience,
      };

      await axiosSecure.post("/staff", application);

      alert("Your application has been submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="py-20 max-w-xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Apply to Become a Staff
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="font-semibold mb-1 block">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            defaultValue={user?.displayName || ""}
            {...register("fullName", { required: true })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">Full Name is required</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold mb-1 block">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            defaultValue={user?.email || ""}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="font-semibold mb-1 block">Phone</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("phone", { required: true })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Phone is required</p>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="font-semibold mb-1 block">Region</label>
          <select
            className="select select-bordered w-full"
            {...register("region", { required: true })}
          >
            <option value="">Select Region</option>
            {[...new Set(loaderData.map((item) => item.region))].map(
              (region, idx) => (
                <option key={idx} value={region}>
                  {region}
                </option>
              )
            )}
          </select>
          {errors.region && (
            <p className="text-red-500 text-sm">Region is required</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="font-semibold mb-1 block">District</label>
          <select
            className="select select-bordered w-full"
            {...register("district", { required: true })}
            disabled={!selectedRegion}
          >
            <option value="">Select District</option>
            {districtsByRegion(selectedRegion).map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm">District is required</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="font-semibold mb-1 block">
            Work Experience (years)
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            {...register("experience", { required: true, min: 0 })}
          />
          {errors.experience && (
            <p className="text-red-500 text-sm">Experience is required</p>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeAStaff;
