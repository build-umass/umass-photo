'use client'
import { FormEvent, use } from "react";

const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
  const token = (e.currentTarget.elements.namedItem("otp") as HTMLInputElement).value;
  const response = await fetch("/api/verify-otp", {
    method: "POST",
    headers: {
      email,
      token
    }
  });
  const responseData = await response.json();
  if (response.ok) {
    localStorage.setItem("loginExpiryTime", (responseData.expires_at * 1000).toString())
    window.location.assign("/")
  }
};

const OtpPage = ({
  searchParams
}: {
  searchParams: Promise<{ email: string }>
}) => {
  const { email } = use(searchParams);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Enter OTP</h1>
      <form
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onSubmit={handleVerifyOtp}
      >
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}
        />
        <input
          type="text"
          name="email"
          defaultValue={email}
          hidden
          aria-hidden
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default OtpPage;