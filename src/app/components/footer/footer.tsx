"use client";

import { faFacebook, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
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
              <h3 className="font-Jaldi font-bold text-lg mb-6 text-gray-700">Gallery</h3>
              <div className="flex flex-col space-y-2">
                <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">All Photos</a>
                <a className = "font-Jaldi block text-gray-700 hover:underline" href = "#">Submit Your photos</a>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi font-bold text-lg mb-6 text-gray-700">Events</h3>
              <div className="flex flex-col space-y-2">
                <div className="font-Jaldi flex flex-col space-y-2">
                  <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Spring contest</a>
                  <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Fall Foliage Contest</a>
                  <a className="font-Jaldi block text-gray-700 hover:underline" href = "#">Summer Contest</a>
                </div>
              </div>
            </div>
            <div className="">
            <h3 className="font-Jaldi font-bold text-lg mb-6 text-gray-700">Mission</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <a className= "font-Jaldi block text-gray-700 hover:underline mb-4" href = "#">Our Story</a>
                  <a className="font-Jaldi block text-gray-700 hover:underline" href = "#">E-Board</a>
                </div>
              </div>
            </div>
            <div className="">
            <h3 className="font-Jaldi font-bold text-lg mb-6 text-gray-700">Contact</h3>
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
  );
}
