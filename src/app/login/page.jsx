"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Ripple } from "m3-ripple";
import "m3-ripple/ripple.css";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
    
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials provided.");
        setLoading(false);
      } else {

        const userRole = data?.user?.role || "user";

        
        if (userRole === "admin") {
          window.location.href = "/dashboard/admin";
        } else if (userRole === "artist") {
          window.location.href = "/dashboard/artist";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError("Google authentication could not be initiated.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 font-sans">
      
      <Card className="w-full max-w-md p-6 shadow-sm border border-gray-200 bg-white rounded-2xl">
        
        <div className="flex flex-col gap-1 pb-4 text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-950">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to manage your marketplace profile.
          </p>
        </div>

        <div className="h-[1px] w-full bg-gray-100 my-2" />

        <div className="py-4 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            
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

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || googleLoading}
                radius="lg"
                className="relative overflow-hidden w-full bg-amber-600 text-white font-bold tracking-wide py-6 shadow-md hover:bg-amber-500 transition-colors text-base disabled:opacity-50 cursor-pointer"
              >
                <Ripple />
                {loading ? "Verifying Credentials..." : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              variant="bordered"
              radius="lg"
              className="relative overflow-hidden w-full border-gray-200 bg-gray-50 text-gray-700 font-bold tracking-wide py-6 hover:bg-gray-100 transition-colors text-base disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Ripple />
              <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.49c0,-0.61 -0.05,-1.2 -0.16,-1.79Z" fill="#4285f4" />
                  <path d="M12,20.72c2.43,0 4.47,-0.81 5.96,-2.19l-3.3,-2.57c-0.91,0.61 -2.08,0.98 -3.34,0.98c-2.34,0 -4.33,-1.58 -5.04,-3.71H2.86v2.65c1.48,2.94 4.52,4.85 8.02,4.85Z" fill="#34a853" />
                  <path d="M6.96,13.23a5.2,5.2 0 0,1 0,-3.32V7.26H2.86a8.72,8.72 0 0,0 0,8.62l4.1,-3.16Z" fill="#fbbc05" />
                  <path d="M12,6.54c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,3.89 14.42,3.08 12,3.08c-3.5,0 -6.54,1.91 -8.02,4.85l4.1,3.16c0.71,-2.13 2.7,-3.71 5.04,-3.71Z" fill="#ea4335" />
                </g>
              </svg>
              <span>{googleLoading ? "Connecting..." : "Google Account"}</span>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            New to the marketplace?{" "}
            <Link href="/register" className="font-semibold text-amber-600 hover:text-amber-500 transition">
              Create an account
            </Link>
          </p>
        </div>
      </Card>

    </div>
  );
}