"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";

import { meetingSchema } from "../../lib/validations";
import CameraCapture from "./CameraCapture";
import api from "../../lib/api";

function dataUrlToBlob(dataUrl) {
  const [meta, data] = dataUrl.split(",");
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  return new Blob([arr], {
    type: meta.match(/:(.*?);/)[1],
  });
}

export default function BusinessMeetingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(meetingSchema),
  });

  const [photo, setPhoto] = useState("");
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await api.get("/employees", {
          params: {
            search,
          },
        });

        setEmployees(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setEmployees([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const handleEmployeeSelect = (employee) => {
    setSelected(employee);
    setOpen(false);
    setSearch("");
  };

  const submit = async (data) => {
    if (!photo) {
      toast.error("Please capture visitor photo");
      return;
    }

    if (!selected) {
      toast.error("Please select the person to meet");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "visitorPhoto",
        dataUrlToBlob(photo),
        "visitor.jpg"
      );

      formData.append(
        "data",
        JSON.stringify({
          ...data,
          personToMeet: {
            employeeId: selected._id,
            name: selected.name,
          },
        })
      );

      await api.post("/business-meetings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      window.location.href = "/visit/success";
    } catch (error) {
      console.error("Business meeting submission error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to submit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 space-y-5"
    >
      {/* Visitor Information */}
      <section className="section-card w-full">
        <h2 className="section-title">Visitor Information</h2>

        {/* Camera */}
        <div className="w-full mt-4">
          <CameraCapture
            value={photo}
            onChange={setPhoto}
          />
        </div>

        {/* Person To Meet */}
        <div className="relative w-full mt-6">
          <label className="label">
            Person to Meet <span className="text-red-500">*</span>
          </label>

          <button
            type="button"
            className="field w-full flex items-center justify-between text-left"
            onClick={() => setOpen((previous) => !previous)}
          >
            <span
              className={
                selected
                  ? "text-slate-700 truncate pr-3"
                  : "text-slate-400"
              }
            >
              {selected
                ? selected.name
                : "Select Person to Meet"}
            </span>

            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Employee Dropdown */}
          {open && (
            <div className="absolute left-0 right-0 z-30 mt-2 w-full max-w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {/* Search */}
              <div className="p-2">
                <div className="relative w-full">
                  <Search
                    size={1}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="text"
                    autoFocus
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by name or department..."
                    className="field w-full pl-10"
                  />
                </div>
              </div>

              {/* Employees */}
              <div className="max-h-56 overflow-y-auto overflow-x-hidden">
                {employees.map((employee) => (
                  <button
                    type="button"
                    key={employee._id}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 active:bg-orange-100 border-t border-slate-100 transition-colors"
                    onClick={() =>
                      handleEmployeeSelect(employee)
                    }
                  >
                    <div className="font-bold text-sm text-slate-700 truncate">
                      {employee.name}
                    </div>

                    <div className="text-xs text-slate-400 mt-1 truncate">
                      {employee.department} ·{" "}
                      {employee.designation}
                    </div>
                  </button>
                ))}

                {!employees.length && (
                  <div className="p-4 text-sm text-slate-400 text-center">
                    No employees found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Employee */}
          {selected && (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {selected.name}
                </p>

                <p className="text-xs text-slate-500 truncate">
                  {selected.designation} ·{" "}
                  {selected.department}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="shrink-0 p-1.5 rounded-lg hover:bg-orange-100 text-slate-500"
                aria-label="Remove selected person"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
          {/* Full Name */}
          <div className="min-w-0">
            <label className="label">
              Full Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              className="field w-full"
              placeholder="Full Name"
              {...register("fullName")}
            />

            {errors.fullName && (
              <div className="error">
                {errors.fullName.message}
              </div>
            )}
          </div>

          {/* Mobile Number */}
          <div className="min-w-0">
            <label className="label">
              Mobile Number{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="tel"
              maxLength={10}
              inputMode="numeric"
              className="field w-full"
              placeholder="Mobile Number"
              {...register("mobileNumber")}
            />

            {errors.mobileNumber && (
              <div className="error">
                {errors.mobileNumber.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="min-w-0">
            <label className="label">
              Email <span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              className="field w-full"
              placeholder="Email"
              {...register("email")}
            />

            {errors.email && (
              <div className="error">
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="min-w-0">
            <label className="label">
              Your Company Name{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              className="field w-full"
              placeholder="Company Name"
              {...register("companyName")}
            />

            {errors.companyName && (
              <div className="error">
                {errors.companyName.message}
              </div>
            )}
          </div>

          {/* Purpose */}
          <div className="sm:col-span-2 min-w-0">
            <label className="label">
              Purpose of Visit{" "}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={3}
              className="field w-full min-h-24 resize-none"
              placeholder="Purpose of Visit"
              {...register("purposeOfVisit")}
            />

            {errors.purposeOfVisit && (
              <div className="error">
                {errors.purposeOfVisit.message}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2 min-w-0">
            <label className="label">
              Address{" "}
              <span className="text-slate-400 font-normal">
                (Optional)
              </span>
            </label>

            <textarea
              rows={3}
              className="field w-full min-h-24 resize-none"
              placeholder="Address (Optional)"
              {...register("address")}
            />

            {errors.address && (
              <div className="error">
                {errors.address.message}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="orange-btn w-full min-h-12 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Check In Now"}
      </button>
    </form>
  );
}