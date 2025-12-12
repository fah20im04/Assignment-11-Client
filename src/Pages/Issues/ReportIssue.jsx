import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { getAuth } from "firebase/auth";
import useAuth from "../../Hooks/useAuth";

const imageHostKey = import.meta.env.VITE_IMAGE_HOST_KEY;

const ReportIssue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const serviceCenters = useLoaderData(); // JSON loader data

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [imageFile, setImageFile] = useState(null);

  const reporterRegion = watch("reporterRegion"); // watch region to filter districts

  // Extract unique regions from JSON
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(serviceCenters.map((c) => c.region))];
    return uniqueRegions;
  }, [serviceCenters]);

  // Filter districts based on selected region
  const districts = useMemo(() => {
    return serviceCenters
      .filter((c) => c.region === reporterRegion)
      .map((c) => c.district);
  }, [serviceCenters, reporterRegion]);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    return data.data.url;
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }

      const issue = {
        title: data.title,
        description: data.description,
        category: data.category,
        image: imageUrl,
        reporterRegion: data.reporterRegion,
        reporterDistrict: data.reporterDistrict,
        // userEmail: user.email,
      };

      const auth = getAuth();
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();

      await axiosSecure.post("/issues", issue, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/my-issues");
    } catch (err) {
      console.error(err);
      alert("Failed to submit issue");
    }
  };

  return (
    <div className="py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto p-6 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>

        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full mb-3"
          {...register("title", { required: true })}
        />
        {errors.title && <p className="text-red-500">Title is required</p>}

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-3"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-red-500">Description is required</p>
        )}

        <select
          className="select select-bordered w-full mb-3"
          {...register("category", { required: true })}
        >
          <option value="">Select Category</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="text-red-500">Category is required</p>
        )}

        <label className="label">Choose Photo</label>
        <input
          type="file"
          className="file-input w-full mb-3"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {/* Reporter Region */}
        <select
          {...register("reporterRegion", { required: true })}
          className="select select-bordered w-full mb-3"
        >
          <option value="">Select your region</option>
          {regions.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.reporterRegion && (
          <p className="text-red-500">Region is required</p>
        )}

        {/* Reporter District */}
        <select
          {...register("reporterDistrict", { required: true })}
          className="select select-bordered w-full mb-3"
        >
          <option value="">Select Reporter District</option>
          {districts.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.reporterDistrict && (
          <p className="text-red-500">District is required</p>
        )}

        <button type="submit" className="btn btn-primary w-full">
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
