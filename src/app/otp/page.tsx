"use client";

import { FormEvent, use } from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { normalizeOtpMode, OtpMode } from "@/app/utils/otpModes";

const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
  const token = (form.elements.namedItem("otp") as HTMLInputElement).value;
  const modeInput = form.elements.namedItem("mode") as HTMLInputElement | null;
  const mode = normalizeOtpMode(modeInput?.value);

  const response = await fetch("/api/verify-otp", {
    method: "POST",
    headers: {
      email,
      token,
      mode,
    },
  });

  if (response.ok) {
    window.location.assign("/");
  }
};

type SearchParams = {
  email?: string;
  mode?: OtpMode;
};

const OtpPage = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { email, mode } = use(searchParams);
  const normalizedMode = normalizeOtpMode(mode);
  const isSignup = normalizedMode === "signup";

  const title = isSignup ? "Confirm Your Email" : "Enter One-Time Code";
  const description = isSignup
    ? "Enter the one-time code we sent to your email to finish creating your account."
    : "Enter the one-time code we sent to your email to sign in to your account.";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <section className="bg-[#8E122A] text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

        <section className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
            <form onSubmit={handleVerifyOtp}>
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
                  name="otp"
                  placeholder="123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8E122A]"
                  required
                />
              </div>

              <input
                type="text"
                name="email"
                defaultValue={email}
                hidden
                aria-hidden
              />
              <input
                type="text"
                name="mode"
                defaultValue={normalizedMode}
                hidden
                aria-hidden
              />

              <button
                type="submit"
                className="w-full bg-[#8E122A] text-white py-3 px-4 rounded-md hover:bg-[#6A0D20] transition font-bold text-lg"
              >
                Verify Code
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OtpPage;