"use client";
import { useRouter } from "next/navigation";
import UmassPhotoButtonRed from "../components/UmassPhotoButton/UmassPhotoButtonRed";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <UmassPhotoButton
      className="mx-auto bg-none text-white border-1"
      onClick={logout}
    >
      Logout
    </UmassPhotoButton>
  );
}
