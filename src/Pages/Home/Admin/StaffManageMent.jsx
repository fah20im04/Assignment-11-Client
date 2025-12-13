import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure"; 
import Swal from "sweetalert2";

const StaffManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all staff applications
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/staff"); // Your backend should return staff applications
      setStaffList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle Accept / Reject
  const handleStatusChange = async (staffEmail, action) => {
    try {
      if (action === "accept") {
        // Update staff status
        await axiosSecure.patch(`/staff/${staffEmail}`, { status: "Accepted" });

        // Update user role to staff
        await axiosSecure.patch(`/users/${staffEmail}/role`, { role: "staff" });

        Swal.fire("Success", "Staff approved successfully!", "success");
      } else if (action === "reject") {
        // Update staff status
        await axiosSecure.patch(`/staff/${staffEmail}`, { status: "Rejected" });
        Swal.fire("Rejected", "Staff application rejected!", "error");
      }

      // Refresh list
      fetchStaff();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Region</th>
            <th className="border p-2">District</th>
            <th className="border p-2">Experience</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.email}>
              <td className="border p-2">{staff.name}</td>
              <td className="border p-2">{staff.email}</td>
              <td className="border p-2">{staff.phone}</td>
              <td className="border p-2">{staff.region}</td>
              <td className="border p-2">{staff.district}</td>
              <td className="border p-2">{staff.experience} yrs</td>
              <td className="border p-2">{staff.status}</td>
              <td className="border p-2 space-x-2">
                {staff.status === "Pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleStatusChange(staff.email, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleStatusChange(staff.email, "reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
