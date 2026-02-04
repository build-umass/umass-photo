"use client";
import { useRouter } from "next/navigation";
import UmassPhotoButton from "../components/UmassPhotoButton";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <UmassPhotoButton
      className="mx-auto border bg-none text-white"
      onClick={logout}
    >
      Logout
    </UmassPhotoButton>
  );
}
