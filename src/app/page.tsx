import Image from "next/image";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Jaldi:wght@400;700&display=swap"
        rel="stylesheet"
      />
      
      <header className="sticky top-0 bg-[#971B2F] shadow-lg z-50" >
        <div className = "max-w-screen-xl mx-auto px-2 py-3 flex items-center">
          <div className="flex items-center transform -translate-x-20 space-x-5">
            <img
              src = "/logo2.png"
              alt = "Umass Photo logo"
              width = {60}
              height = {60}
            />
            <p className= "font-Jaldi text-white text-3xl font-bold">Umass Photo</p>
          </div>

          <div className="ml-auto flex items-center pr-7">
            <a className = "font-Jaldi text-white text-2xl font-normal mr-16" href = "#">home</a>
            <a className = "font-Jaldi text-white text-2xl font-normal mr-16" href = "#">gallery</a>
            <a className = "font-Jaldi text-white text-2xl font-normal mr-16" href = "#">events</a>
            <a className = "font-Jaldi text-white text-2xl font-normal mr-16" href = "#">about</a>
            <a className = "font-Jaldi text-white text-2xl font-normal ml-auto" href = "#">contact</a>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-white">
        <div className="relative overflow-x-auto whitespace-nowrap w-full h-[375px] bg-white shadow-xl mb-6">
          <div className="flex h-full">
            <img
              src = "/herter.png"
              alt = "image_1"
              className="inline-block h-full w-auto object-cover"         
            />
            <img
              src = "/fine_arts.png"
              alt = "image_3"
              className="inline-block h-full w-auto object-cover"         
            />
            <img
              src = "Umass_photo.png"
              alt = "image_4"
              className="inline-block h-full w-auto object-cover"         
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 mb-4">
          <p className="font-Jaldi font-bold text-[#971B2F] text-3xl mb-4">About Us:</p>
          <div className="flex flex-col md:flex-row items-start">
            <img
              src = "/photographer.png"
              alt = "image_5"
              className = "mb-10 md:mr-8"
              width={400}
              height={400}
            />
            <div className="flex flex-col">
              <p className="font-Jaldi font-normal text-gray-700 text-lg mb-2">Lorem ipsum odor amet, consectetuer adipiscing elit. Sagittis gravida eleifend inceptos nullam est fusce etiam. Imperdiet pretium tortor nisl; mus id senectus commodo. Nam sagittis tellus, finibus netus tempor purus. Lobortis cursus viverra commodo torquent non platea dignissim elit hac. Curabitur elementum consectetur volutpat potenti hendrerit mattis penatibus duis? Vitae placerat curabitur accumsan phasellus fringilla porttitor bibendum augue. Adictum natoque, justo vel dictumst tempor.
    Pretium himenaeos placerat phasellus turpis maecenas convallis. Euismod proin potenti pretium netus convallis enim a. Suspendisse nullam consectetur ac nostra orci ullamcorper. Massa ullamcorper feugiat nec litora vitae. Efficitur facilisi elit nam sit primis malesuada. Libero fermentum amet eget primis convallis dis cursus?</p>
              <a className="font-Jaldi font-bold text-[#971B2F] hover:underline text-2xl" href="#">Learn More &gt;</a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 mb-4">
          <p className="font-Jaldi font-bold text-[#971B2F] text-3xl mb-4">Our E-Board</p>
          <div className="flex flex-col md:flex-row items-start">
            <img
              src = "/E-Board.png"
              alt = "image_6"
              className = "mb-10 md:mr-8"
              width={400}
              height={400}
            />
            <div className="flex flex-col">
              <p className="font-Jaldi font-normal text-gray-700 text-lg mb-4">Lorem ipsum odor amet, consectetuer adipiscing elit. Sagittis gravida eleifend inceptos nullam est fusce etiam. Imperdiet pretium tortor nisl; mus id senectus commodo. Nam sagittis tellus, finibus netus tempor purus. Lobortis cursus viverra commodo torquent non platea dignissim elit hac. Curabitur elementum consectetur volutpat potenti hendrerit mattis penatibus duis? Vitae placerat curabitur accumsan phasellus fringilla porttitor bibendum augue. Adictum natoque, justo vel dictumst tempor.
    Pretium himenaeos placerat phasellus turpis maecenas convallis. Euismod proin potenti pretium netus convallis enim a. Suspendisse nullam consectetur ac nostra orci ullamcorper. Massa ullamcorper feugiat nec litora vitae. Efficitur facilisi elit nam sit primis malesuada. Libero fermentum amet eget primis convallis dis cursus?</p>
              <a className="font-Jaldi font-bold text-[#971B2F] text-2xl hover:underline" href="#">Learn More &gt;</a>
            </div>
          </div>
        </div>

      </main>

      <footer className = "bg-gray-200">
        <div className="max-w-screen-xl mx-auto px-3 py-15">
          <div className="flex flex-wrap justify-between">
            <div className="">
              <h3 className="font-Jaldi font-bold text-[#971B2F] text-3xl mb-4">Umass Photo</h3>
              <div className="flex space-x-6 hover:underline mb-4">
                <a className = "text-gray-500 hover:text-gray-700" href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a className = "text-gray-500 hover:text-gray-700" href="#"><FontAwesomeIcon icon={faLinkedin} /></a> 
                <a className = "text-gray-500 hover:text-gray-700" href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                <a className = "text-gray-500 hover:text-gray-700" href="#"><FontAwesomeIcon icon={faInstagram} /></a>              
              </div>
              <p className="text-gray-400 text-base font-normal">Website © BUILD Umass 2025</p>
            </div> 
            <div className="ml-auto flex space-x-20">
              <div className="">
                <h3 className="font-Jaldi font-bold text-lg mb-6">Gallery</h3>
                <div className="flex flex-col space-y-2">
                  <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">All Photos</a>
                  <a className = "font-Jaldi block text-gray-700 hover:underline" href = "#">Submit Your photos</a>
                </div>
              </div>
              <div className="">
                <h3 className="font-Jaldi font-bold text-lg mb-6">Events</h3>
                <div className="flex flex-col space-y-2">
                  <div className="font-Jaldi flex flex-col space-y-2">
                    <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Spring contest</a>
                    <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Fall Foliage Contest</a>
                    <a className="font-Jaldi block text-gray-700 hover:underline" href = "#">Summer Contest</a>
                  </div>
                </div>
              </div>
              <div className="">
              <h3 className="font-Jaldi font-bold text-lg mb-6">Mission</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-2">
                    <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Our Story</a>
                    <a className="font-Jaldi block text-gray-700 hover:underline" href = "#">E-Board</a>
                  </div>
                </div>
              </div>
              <div className="">
              <h3 className="font-Jaldi font-bold text-lg mb-6">Contact</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-2">
                    <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Instagram</a>
                    <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Email</a>
                    <a className="font-Jaldi block text-gray-700 hover:underline" href = "#">Page</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </footer>
    


    </div> 
  
    /*<div className="grid grid-rows-[100px_1fr_100px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>*/
  );
}
