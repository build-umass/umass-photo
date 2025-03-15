import Image from "next/image";
import PhotoGallery from "./Photo Gallery/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <PhotoGallery />
    </main>
  );
}
