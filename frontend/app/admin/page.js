"use client";
import { useEffect, useState } from "react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import api from "../../lib/api";
export default function Admin() {
  const [ok, setOk] = useState(null);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setOk(true))
      .catch(() => (window.location.href = "/admin/login"));
  }, []);
  if (ok === null)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  return <AdminDashboard />;
}
