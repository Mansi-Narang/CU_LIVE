import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router";

const Signup = () => {
  const [isFirstClick, setIsFirstClick] = useState(false);
  const [realOTP, setRealOTP] = useState("");
  const [selectedSignup, setSelectedSignup] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    password: "",
    otp: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, uid, password, otp } = formData;

    if (!name || !uid || !password) {
      await Swal.fire({
        toast: true,
        title: "Please fill all fields",
        icon: "error",
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    if (!isFirstClick) {
      try {
        const res = await axiosClient.post("/otp", { uid });
        setRealOTP(res.data.otp);
        setIsFirstClick(true);
        
        await Swal.fire({
          toast: true,
          position: "top",
          timer: 2000,
          timerProgressBar: true,
          title: "OTP sent to your email",
          icon: "success"
        });
      } catch (error) {
        await Swal.fire({
          toast: true,
          title: "Failed to send OTP",
          icon: "error",
          position: 'top',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } else {
      if (Number(otp) !== Number(realOTP)) {
        await Swal.fire({
          toast: true,
          title: "Invalid OTP",
          icon: "error",
          position: 'top',
          timer: 2000,
          timerProgressBar: true,
        });
        return;
      }

      try {
        const res = await axiosClient.post("/signup", { name, uid, password });
        await Swal.fire({
          toast: true,
          title: res.data.msg,
          icon: res.data.success ? "success" : "error",
          position: 'top',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        if (res.data.success) {
          window.location.href = "/";
        }
      } catch (error) {
        await Swal.fire({
          toast: true,
          title: "Signup failed",
          icon: "error",
          position: 'top',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-6 px-8 text-center relative">
          <h1 className="text-4xl font-bold mb-2">
            <span className="inline-block">
              {['C', 'U', ' ', 'L', 'I', 'V', 'E'].map((char, i) => (
                <motion.span
                  key={i}
                  style={{ display: 'inline-block' }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>
          <p className="text-sm opacity-90">Experience the best in Events, Workshops, and Competitions.</p>
        </div>

        <div className="p-8">
          <div className="flex mb-6 border-b">
           
            <button 
              className="flex-1 py-2 font-medium text-center border-b-2 border-purple-600 text-purple-600"
            >
              Sign Up
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Join the CU LIVE community</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-1">
                  College UID
                </label>
                <input
                  type="text"
                  id="uid"
                  name="uid"
                  value={formData.uid}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your college UID"
                  required
                />
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter OTP sent to your email"
                  required
                  disabled={!isFirstClick}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
              >
                {isFirstClick ? "Sign Up" : "Verify"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;