"use client";

import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("password"); // 'password', 'magiclink', or 'otp'
  const router = useRouter();

  const handlePasswordLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/login-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      try {
        const body = await response.json();
        setError(body.error ?? "Failed to sign in. Please try again.");
      } catch {
        setError("Failed to sign in. Please try again.");
      }
      return;
    }

    router.push("/");
  };

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const response = await fetch("/api/request-otp", {
      method: "POST",
      headers: {
        email,
      },
    });
    if (response.ok) {
      const params = new URLSearchParams({
        email,
        mode: "login",
      });
      window.location.assign(`/otp?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow bg-gray-50">
        <section className="bg-umass-red text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Sign in to access your account and manage your photography
              portfolio
            </p>
          </div>
        </section>

        {/* login form */}
        <section className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex mb-6 border-b">
              <button
                className={`flex-1 py-2 font-medium ${
                  loginMethod === "password"
                    ? "text-umass-red border-b-2 border-umass-red"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("password")}
              >
                Password
              </button>
              <button
                className={`flex-1 py-2 font-medium ${
                  loginMethod === "magiclink"
                    ? "text-umass-red border-b-2 border-umass-red"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("magiclink")}
              >
                Magic Link
              </button>
              <button
                className={`flex-1 py-2 font-medium ${
                  loginMethod === "otp"
                    ? "text-umass-red border-b-2 border-umass-red"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("otp")}
              >
                One-Time Code
              </button>
            </div>

            <form
              onSubmit={
                loginMethod === "password"
                  ? handlePasswordLogin
                  : loginMethod === "magiclink"
                  ? () => {}
                  : handleSendOtp
              }
            >
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-umass-red"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {loginMethod === "password" && (
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-umass-red"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-umass-red text-white py-3 px-4 rounded-md hover:bg-[#6A0D20] transition font-bold text-lg"
              >
                {loginMethod === "password"
                  ? "Sign In"
                  : loginMethod === "magiclink"
                  ? "Send Magic Link"
                  : "Send One-Time Code"}
              </button>
            </form>

            {loginMethod === "password" && (
              <div className="mt-6 text-center">
                <a
                  href="/forgot-password"
                  className="text-umass-red hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-umass-red font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
