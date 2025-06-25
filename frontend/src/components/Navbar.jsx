import React from "react";
import { useUser } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import Swal from 'sweetalert2';

const Navbar = () => {

  const { user, userLoading } = useUser();

  const handleLogout = async(e) => {
    e.preventDefault();

    const res = await axiosClient({
      method: "post",
      data: { user },
      url: "/logout"
    });

    const response = res.data;

    await Swal.fire({
      position: "top",
      toast: true,
      timer: 2000,
      timerProgressBar: true,
      showCancelButton: false,
      showCloseButton: false,
      showConfirmButton: false,
      showDenyButton: false,
      title: response.msg,
      icon: response.success ? "success" :"error"
    });

    { window.location.href = "/" }
    return;
  }

  return (
    <div className="relative position">
      <div className="flex items-center justify-between bg-black p-4 text-white">
        {/* Left Side - Logo */}
        <h1 className="text-2xl font-bold mr-auto text-white-500">CU LIVE</h1>
        
        {/* Right Side - Tabs */}
        <div className="flex space-x-4">
          <a href="/" className="px-6 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-300">
            🎶 Events
          </a>
          {!user && <a href="/login" className="px-6 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-300">
            🔑 Login
          </a> }
          {!user && <a href="/signup" className="px-6 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-300">
            📝 SignUp
          </a>}
          {user && <span onClick={handleLogout} className="px-6 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-purple-600 hover:text-white transition-all duration-300">
            📤 Logout
          </span>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;