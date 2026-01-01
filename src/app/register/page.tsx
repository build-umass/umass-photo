"use client";

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
          "Password is too weak. Try using a longer passphrase with a mix of words, numbers, and symbols.",
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
      if (response.status === 409) {
        setError(
          "An account with this email already exists. To add a password, please log in and update your account settings.",
        );
        return;
      }
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
    <main className="grow bg-gray-50">
      <section className="bg-umass-red py-16 text-white">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">Create an Account</h1>
          <p className="mx-auto max-w-2xl text-xl">
            Sign up to join the UMass Photo community and share your work.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white p-8 shadow-md">
          {error && (
            <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-md bg-green-100 p-4 text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleRegister}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-umass-red w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
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

            <div className="mb-8">
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus:ring-umass-red w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-umass-red cursor-camera w-full rounded-md px-4 py-3 text-lg font-bold text-white transition hover:bg-[#6A0D20]"
            >
              Sign Up
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-umass-red cursor-camera font-semibold hover:underline"
                >
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
