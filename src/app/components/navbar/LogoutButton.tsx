export default function LogoutButton() {
    async function logout(){
        await fetch("/api/logout", {method:"POST"})
        localStorage.removeItem("loginExpiryTime")
        window.location.href="/"
    }
    return <button className="flex items-center justify-center text-lg font-bold hover:bg-white/20 transition-colors duration-200 h-full px-6" onClick={logout}>Logout</button>
}