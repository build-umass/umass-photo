import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Jaldi:wght@400;700&display=swap"
        rel="stylesheet"
      />
      
      <Navbar></Navbar>

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
    <Footer></Footer>
    </div> 
  );
}
