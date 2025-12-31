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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow bg-gray-50">
        <section className="bg-umass-red py-16 text-white">
          <div className="container mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold">Welcome Back</h1>
            <p className="mx-auto max-w-2xl text-xl">
              Sign in to access your account and manage your photography
              portfolio
            </p>
          </div>
        </section>

        {/* login form */}
        <section className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white p-8 shadow-md">
            {error && (
              <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="mb-6 flex border-b">
              <button
                className={`cursor-camera flex-1 py-2 font-medium ${
                  loginMethod === "password"
                    ? "text-umass-red border-umass-red border-b-2"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("password")}
              >
                Password
              </button>
              <button
                className={`cursor-camera flex-1 py-2 font-medium ${
                  loginMethod === "magiclink"
                    ? "text-umass-red border-umass-red border-b-2"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("magiclink")}
              >
                Magic Link
              </button>
              <button
                className={`cursor-camera flex-1 py-2 font-medium ${
                  loginMethod === "otp"
                    ? "text-umass-red border-umass-red border-b-2"
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
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-umass-red w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {loginMethod === "password" && (
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-umass-red w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="bg-umass-red cursor-camera w-full rounded-md px-4 py-3 text-lg font-bold text-white transition hover:bg-[#6A0D20]"
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
                  className="text-umass-red cursor-camera hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-umass-red cursor-camera font-semibold hover:underline"
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
