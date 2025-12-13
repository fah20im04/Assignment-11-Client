import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure"; 
import { useQuery } from "@tanstack/react-query";

export function AssignModal({ issue, onClose, onAssign }) {
  console.log(issue);
  const axiosSecure = useAxiosSecure();

  const { data: staff = [] } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staff"); // get all staff
      return res.data;
    },
  });

  // Filter staff by reporter's district
  const filteredStaff = staff.filter(
    (s) => s.district === issue.reporterDistrict && s.status === "Accepted"
  );

  const [selected, setSelected] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h3 className="text-lg font-bold mb-3">
          Assign Staff to: {issue.title}
        </h3>
        <select
          className="select w-full mb-3"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select staff</option>
          {filteredStaff.map((s) => (
            <option key={s.email} value={s.email}>
              {s.displayName || s.email} ({s.district})
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            onClick={() => {
              const staffObj = filteredStaff.find((s) => s.email === selected);
              onAssign(selected, staffObj?.displayName || selected);
            }}
            className="btn btn-primary"
            disabled={!selected}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
