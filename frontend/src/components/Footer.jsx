import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-10 text-center relative">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-left">
          <h1 className="text-3xl font-bold">CU Live</h1>
          <p className="mt-2 text-lg font-semibold">
            The best of college events, fests, concerts, and fun activities.
          </p>
          <p className="text-md">Find your next plan on CU Live</p>
        </div>

        {/* Unique Element Instead of QR Code */}
        <div className="bg-white text-purple-700 p-4 rounded-xl shadow-lg text-center w-48 h-48 flex flex-col justify-center items-center">
          <p className="font-bold text-lg">Join Now</p>
          <p className="text-sm">Sign up and be part of exciting events!</p>
          <button className="mt-3 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm">Get Started</button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 border-t border-white/20 pt-5 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex space-x-5 mb-4 md:mb-0">
          <a href="#" className="hover:underline">Terms & Conditions</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
        <div className="flex space-x-4 text-lg">
          <a href="#" className="hover:text-gray-300"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-300"><FaXTwitter /></a>
          <a href="#" className="hover:text-gray-300"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
