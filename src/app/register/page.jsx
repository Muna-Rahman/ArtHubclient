"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Ripple } from "m3-ripple";
import "m3-ripple/ripple.css";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", 
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

      // 🌟 STEP 1: Direct dispatch to the explicit endpoint to bypass client stripping rules
      const response = await fetch(`${apiBaseUrl}/api/auth/register-direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role, 
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setError(resData.message || "Registration processing failed.");
        setLoading(false);
        return;
      }

      // 🌟 STEP 2: Log the user in to seamlessly generate the session collection link
      const loginRes = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (loginRes.error) {
        // Fallback redirection to complete token mounting if cookies delay
        window.location.href = "/login";
      } else {
        window.location.href = formData.role === "artist" ? "/dashboard/artist" : "/";
      }

    } catch (err) {
      setError("An unexpected system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 font-sans">
      
      <Card className="w-full max-w-md p-6 shadow-sm border border-gray-200 bg-white rounded-2xl">
        
        <div className="flex flex-col gap-1 pb-4 text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-950">
            Create your account
          </h2>
          <p className="text-sm text-gray-500">
            Join ArtHub to explore, collect, or exhibit original pieces.
          </p>
        </div>

        <div className="h-[1px] w-full bg-gray-100 my-2" />

        <div className="py-4 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Mahbuba Rahman"
                value={formData.name}
                onChange={handleChange}
                variant="bordered"
                radius="lg"
                required
                className="w-full text-gray-900 bg-gray-50 focus:border-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@arthub.com"
                value={formData.email}
                onChange={handleChange}
                variant="bordered"
                radius="lg"
                required
                className="w-full text-gray-900 bg-gray-50 focus:border-gray-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-800">Select Profile Role</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("user")}
                  className={`p-3 rounded-xl border text-sm font-bold tracking-wide transition cursor-pointer text-center focus:outline-none ${
                    formData.role === "user"
                      ? "border-amber-600 bg-amber-50/60 text-amber-800 shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  User (Buyer)
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("artist")}
                  className={`p-3 rounded-xl border text-sm font-bold tracking-wide transition cursor-pointer text-center focus:outline-none ${
                    formData.role === "artist"
                      ? "border-amber-600 bg-amber-50/60 text-amber-800 shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Artist Creator
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                variant="bordered"
                radius="lg"
                required
                className="w-full text-gray-900 bg-gray-50 focus:border-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="bordered"
                radius="lg"
                required
                className="w-full text-gray-900 bg-gray-50 focus:border-gray-500"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                radius="lg"
                className="relative overflow-hidden w-full bg-amber-600 text-white font-bold tracking-wide py-6 shadow-md hover:bg-amber-500 transition-colors text-base disabled:opacity-50 cursor-pointer"
              >
                <Ripple />
                {loading ? "Creating Account..." : "Register Account"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-500 transition">
              Sign in instead
            </Link>
          </p>
        </div>
      </Card>

    </div>
  );
}