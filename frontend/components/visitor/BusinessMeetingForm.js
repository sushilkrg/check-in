"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingSchema } from "../../lib/validations";
import CameraCapture from "./CameraCapture";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Search, ChevronDown } from "lucide-react";
function dataUrlToBlob(dataUrl) {
  const [meta, data] = dataUrl.split(",");
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: meta.match(/:(.*?);/)[1] });
}
export default function BusinessMeetingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(meetingSchema) });
  const [photo, setPhoto] = useState("");
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const r = await api.get("/employees", { params: { search } });
        setEmployees(r.data.data || []);
      } catch {
        setEmployees([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [search]);
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
      const fd = new FormData();
      fd.append("visitorPhoto", dataUrlToBlob(photo), "visitor.jpg");
      fd.append(
        "data",
        JSON.stringify({
          ...data,
          personToMeet: { employeeId: selected._id, name: selected.name },
        }),
      );
      await api.post("/business-meetings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.href = "/visit/success";
    } catch (e) {
      toast.error(
        e?.response?.data?.message || "Unable to submit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <section className="section-card">
        <h2 className="section-title">Visitor Information</h2>
        <CameraCapture value={photo} onChange={setPhoto} />
        <div className="mt-5 relative">
          <label className="label">Person to Meet *</label>
          <button
            type="button"
            className="field flex items-center justify-between text-left"
            onClick={() => setOpen(!open)}
          >
            <span className={selected ? "text-slate-700" : "text-slate-400"}>
              {selected ? selected.name : "Select Person to Meet"}
            </span>
            <ChevronDown size={17} />
          </button>
          {open && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              <div className="p-2">
                <div className="relative">
                  <Search
                    size={1}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    autoFocus
                    className="field pl-9"
                    placeholder="Search by name or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-auto hide-scrollbar">
                {employees.map((e) => (
                  <button
                    type="button"
                    key={e._id}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 border-t border-slate-100"
                    onClick={() => {
                      setSelected(e);
                      setOpen(false);
                    }}
                  >
                    <div className="font-bold text-sm">{e.name}</div>
                    <div className="text-xs text-slate-400">
                      {e.department} · {e.designation}
                    </div>
                  </button>
                ))}
                {!employees.length && (
                  <div className="p-4 text-sm text-slate-400">
                    No employees found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 grid-mobile-1">
          <div>
            <label className="label">Full Name *</label>
            <input
              className="field"
              placeholder="Full Name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <div className="error">{errors.fullName.message}</div>
            )}
          </div>
          <div>
            <label className="label">Mobile Number *</label>
            <input
              className="field"
              maxLength={10}
              inputMode="numeric"
              placeholder="Mobile Number"
              {...register("mobileNumber")}
            />
            {errors.mobileNumber && (
              <div className="error">{errors.mobileNumber.message}</div>
            )}
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              className="field"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <div className="error">{errors.email.message}</div>
            )}
          </div>
          <div>
            <label className="label">Your Company Name *</label>
            <input
              className="field"
              placeholder="Company Name"
              {...register("companyName")}
            />
            {errors.companyName && (
              <div className="error">{errors.companyName.message}</div>
            )}
          </div>
          <div className="col-span-2">
            <label className="label">Purpose of Visit *</label>
            <input
              className="field"
              placeholder="Purpose of Visit"
              {...register("purposeOfVisit")}
            />
            {errors.purposeOfVisit && (
              <div className="error">{errors.purposeOfVisit.message}</div>
            )}
          </div>
          <div className="col-span-2">
            <label className="label">Address (Optional)</label>
            <textarea
              className="field min-h-24"
              placeholder="Address (Optional)"
              {...register("address")}
            />
          </div>
        </div>
      </section>
      <button disabled={loading} className="orange-btn w-full">
        {loading ? "Submitting..." : "Check In Now"}
      </button>
    </form>
  );
}
