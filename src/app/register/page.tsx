"use client";

import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const strength = zxcvbn(password);
    if (strength.score < 3) {
      setError(
        strength.feedback.warning ||
          "Password is too weak. Try using a longer passphrase with a mix of words, numbers, and symbols."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/register-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      try {
        const body = await response.json();
        setError(body.error ?? "Failed to sign up. Please try again.");
      } catch {
        setError("Failed to sign up. Please try again.");
      }
      return;
    }

    try {
      const body = await response.json();
      if (body.needsEmailConfirmation) {
        const params = new URLSearchParams({
          email,
          mode: "signup",
        });
        window.location.assign(`/otp?${params.toString()}`);
        return;
      }
    } catch {
      // If we can't parse JSON, just continue and redirect.
    }

    // Either we already have a session or signup succeeded without requiring confirmation.
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow bg-gray-50">
        <section className="bg-umass-red text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Sign up to join the UMass Photo community and share your work.
            </p>
          </div>
        </section>

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

            <form onSubmit={handleRegister}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-umass-red"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-6">
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

              <div className="mb-8">
                <label
                  htmlFor="confirm-password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-umass-red"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-umass-red text-white py-3 px-4 rounded-md hover:bg-[#6A0D20] transition font-bold text-lg"
              >
                Sign Up
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-umass-red font-semibold hover:underline"
                  >
                    Log in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
