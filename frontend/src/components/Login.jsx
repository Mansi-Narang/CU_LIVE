import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import Swal from "sweetalert2";

const Login = () => {
  const [formData, setFormData] = useState({
    uid: "",
    password: ""
  });
  const [selectedLogin, setSelectedLogin] = useState("student");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { uid, password } = formData;

    if (!uid || !password) {
      await Swal.fire({
        toast: true,
        title: "Invalid credentials",
        icon: "error",
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const res = await axiosClient.post("/login", { uid, password });
      const result = res.data;

      await Swal.fire({
        toast: true,
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        icon: result.success ? "success" : "error",
        title: result.msg,
        showConfirmButton: false
      });

      window.location.href = result.isOrganizer ? "/organizer" : "/";
    } catch (error) {
      console.error(error);

      await Swal.fire({
        toast: true,
        title: "Login failed",
        icon: "error",
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh]"
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
              Login
            </button>
           
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Login to continue to CU LIVE</p>
            
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedLogin("student")}
                className={`flex-1 py-3 rounded-md font-medium ${selectedLogin === "student" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Student
              </button>
              <button
                onClick={() => setSelectedLogin("organizer")}
                className={`flex-1 py-3 rounded-md font-medium ${selectedLogin === "organizer" ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Organizer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedLogin === "student" ? "College ID" : "User ID"}
                </label>
                <input
                  type="text"
                  id="uid"
                  name="uid"
                  value={formData.uid}
                  onChange={handleInput}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={selectedLogin === "student" ? "Enter your college ID" : "Enter your user ID"}
                  required
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
                  onChange={handleInput}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="text-right">
                <button type="button" className="text-sm text-purple-600 hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;