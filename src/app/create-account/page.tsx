"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const CreateAccountPage = () => {
  const router = useRouter();

  async function requestAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = (
      e.currentTarget.elements.namedItem("username") as HTMLInputElement
    ).value;
    const bio = (e.currentTarget.elements.namedItem("bio") as HTMLInputElement)
      .value;
    const response = await fetch("/api/create-account-self", {
      method: "POST",
      body: JSON.stringify({
        username,
        bio,
      }),
    });
    if (response.ok) router.push("/");
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>Enter Username</h1>
      <form
        onSubmit={requestAccount}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
        />
        <input
          type="text"
          name="bio"
          placeholder="Enter Bio"
          style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
        />
        <button
          type="submit"
          className="cursor-camera"
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateAccountPage;
