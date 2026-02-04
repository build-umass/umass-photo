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
  return <UmassPhotoButtonRed onClick={logout}>Log Out</UmassPhotoButtonRed>;
}
