import Footer from "../components/footer/footer";
import Navbar from "../components/navbar/navbar";

export default function MePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Footer />
    </div>
  );
}
