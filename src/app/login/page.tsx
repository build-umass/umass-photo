"use client";

import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, _setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password"); // 'password', 'magiclink', or 'otp'
  const router = useRouter();

  // const handlePasswordLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     router.push("/dashboard");
  //   }
  // };

  // const handleMagicLinkLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   const { error } = await supabase.auth.signInWithOtp({
  //     email,
  //     options: {
  //       emailRedirectTo: `${window.location.origin}/dashboard`,
  //     },
  //   });

  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     setSuccessMessage("Check your email for the login link!");
  //   }
  // };

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const response = await fetch("/api/request-otp", {
      method: "POST",
      headers: {
        email
      }
    });
    if (response.ok) {
      const params = new URLSearchParams({
        email
      })
      window.location.assign(`/otp?${params.toString()}`)
    }
  };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   const { error } = await supabase.auth.verifyOtp({
  //     email,
  //     token: otp,
  //     type: "email",
  //   });

  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     router.push("/dashboard");
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <section className="bg-[#8E122A] text-white py-16">
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

            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            <div className="flex mb-6 border-b">
              <button
                className={`flex-1 py-2 font-medium ${
                  loginMethod === "password"
                    ? "text-[#8E122A] border-b-2 border-[#8E122A]"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("password")}
              >
                Password
              </button>
              <button
                className={`flex-1 py-2 font-medium ${
                  loginMethod === "magiclink"
                    ? "text-[#8E122A] border-b-2 border-[#8E122A]"
                    : "text-gray-500"
                }`}
                onClick={() => setLoginMethod("magiclink")}
              >
                Magic Link
              </button>
              <button
                className={`flex-1 py-2 font-medium ${
                  loginMethod === "otp"
                    ? "text-[#8E122A] border-b-2 border-[#8E122A]"
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
                  ? () => {}
                  : loginMethod === "magiclink"
                  ? () => {}
                  : showOtpField
                  ? () => {} :
                  handleSendOtp
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E122A]"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E122A]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {loginMethod === "otp" && showOtpField && (
                <div className="mb-8">
                  <label
                    htmlFor="otp"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    One-Time Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E122A]"
                    placeholder="123456"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#8E122A] text-white py-3 px-4 rounded-md hover:bg-[#6A0D20] transition font-bold text-lg"
              >
                {loginMethod === "password"
                  ? "Sign In"
                  : loginMethod === "magiclink"
                  ? "Send Magic Link"
                  : showOtpField
                  ? "Verify Code"
                  : "Send One-Time Code"}
              </button>
            </form>

            {loginMethod === "password" && (
              <div className="mt-6 text-center">
                <a
                  href="/forgot-password"
                  className="text-[#8E122A] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-[#8E122A] font-semibold hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
