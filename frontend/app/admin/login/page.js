"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import Brand from "../../../components/visitor/Brand";
export default function Login() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const submit = async (d) => {
    setLoading(true);
    try {
      await api.post("/auth/login", d);
      window.location.href = "/admin";
    } catch (e) {
      toast.error(e?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="container-card max-w-md">
        <Brand />
        <h1 className="font-extrabold text-xl text-center mt-8">Admin Login</h1>
        <form onSubmit={handleSubmit(submit)} className="space-y-4 mt-6">
          <div>
            <label className="label">Email</label>
            <input
              className="field"
              type="email"
              placeholder="Admin email"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="field"
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
          </div>
          <button disabled={loading} className="orange-btn w-full">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
