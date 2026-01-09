"use client";

import { FormEvent, use } from "react";
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

  try {
    if (!response.ok) {
      throw new Error("Failed to verify OTP");
    }
    const { expires_at: atExpiryTime, userExists } = await response.json();
    localStorage.setItem("loginExpiryTime", (atExpiryTime * 1000).toString());
    if (!userExists) {
      window.location.assign("/create-account");
    } else {
      window.location.assign("/");
    }
  } catch (error) {
    console.error(error);
  }
};

type SearchParams = {
  email?: string;
  mode?: OtpMode;
};

const OtpPage = ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const { email, mode } = use(searchParams);
  const normalizedMode = normalizeOtpMode(mode);
  const isSignup = normalizedMode === "signup";

  const title = isSignup ? "Confirm Your Email" : "Enter One-Time Code";
  const description = isSignup
    ? "Enter the one-time code we sent to your email to finish creating your account."
    : "Enter the one-time code we sent to your email to sign in to your account.";

  return (
    <>
      <section className="bg-[#8E122A] py-16 text-white">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">{title}</h1>
          <p className="mx-auto max-w-2xl text-xl">{description}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white p-8 shadow-md">
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-8">
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                One-Time Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="123456"
                className="focus:ring-umass-red w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none"
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
              className="bg-umass-red w-full rounded-md px-4 py-3 text-lg font-bold text-white transition hover:bg-[#6A0D20]"
            >
              Verify Code
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default OtpPage;
