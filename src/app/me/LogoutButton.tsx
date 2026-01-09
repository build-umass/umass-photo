"use client";
import { useRouter } from "next/navigation";
import UmassPhotoButton from "../components/UmassPhotoButton";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("loginExpiryTime");
    router.push("/");
  }
  return (
    <UmassPhotoButton
      className="mx-auto block bg-none text-white"
      onClick={logout}
    >
      Logout
    </UmassPhotoButton>
  );
}
