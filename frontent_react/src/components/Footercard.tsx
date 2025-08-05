import React from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const FooterCard: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
        
        {/* About Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">CSD & CSIT Houses</h3>
          <p className="text-sm leading-relaxed">
            A platform for college students to showcase their talent by
            participating in various tech events, challenges, and competitions
            organized by the houses of CSD & CSIT departments.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-500">Home</a></li>
              <li><a href="/events" className="hover:text-blue-500">Events</a></li>
              <li><a href="/leaderboard"className="hover:text-blue-500">Leaderboard</a></li>
            </ul>
          </div>

          {/* Houses List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Houses</h3>
            <ul className="space-y-2 text-sm">
            <li><a href="/house/Jal" className="hover:text-blue-500">Jal</a></li>
              <li><a href="/house/Agni" className="hover:text-blue-500">Agni</a></li>
              <li><a href="/house/Vayu" className="hover:text-blue-500">Vayu</a></li>
              <li><a href="/house/Prudhvi" className="hover:text-blue-500">Prudhvi</a></li>
              <li><a href="/house/Aakash" className="hover:text-blue-500">Aakash</a></li>
            </ul>
          </div>
        </div>

        {/* Social & Contact Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.facebook.com/srkrcsd"
              aria-label="Facebook"
              className="text-2xl hover:text-blue-600"
            >
              <FaFacebook />
            </a>
           
            <a
              href="https://www.linkedin.com/in/csd-srkrec-5b3727225/"
              aria-label="LinkedIn"
              className="text-2xl hover:text-blue-700"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/srkrcsdcsit/"
              aria-label="Instagram"
              className="text-2xl hover:text-pink-500"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="text-sm">
            Contact us:{" "}
            <a
              href="mailto:contact@srkrcsdcsit.in"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact@csdhouses.com
            </a>
          </p>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} CSD & CSIT Houses. 
      </div>
    </footer>
  );
};

export default FooterCard;
