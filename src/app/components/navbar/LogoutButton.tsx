export default function LogoutButton() {
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("loginExpiryTime");
    window.location.href = "/";
  }
  return (
    <button
      className="flex h-full items-center justify-center px-6 text-lg font-bold transition-colors duration-200 hover:bg-white/20"
      onClick={logout}
    >
      Logout
    </button>
  );
}
