import Navbar from "./navbar/navbar"; // Import Navbar from the navbar folder
import Footer from "./footer/footer"; // Import Footer from the footer folder

export default function ComponentsPreview() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-2xl font-bold">placeholder main page</h1>
      </main>
      <Footer />
    </div>
  );
}
