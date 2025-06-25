import React, { useState } from "react";
import { Link } from "react-router";
import { useUser } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import Swal from 'sweetalert2'

const Navbar = () => {
    const [activeTab, setActiveTab] = useState("List Your Events");

    const user = useUser();

    const handleLogoutClick = async (e) => {
        e.preventDefault();

        const res = await axiosClient.post("/logout", { user });
        const response = res.data;

        await Swal.fire({
            toast: true,
            title: response.msg,
            icon: response.success ? "success" : "error",
            position: 'top',
            showCancelButton: false,
            showConfirmButton: false,
            showDenyButton: false,
            showCloseButton: false,
            timer: 2000,
            timerProgressBar: true,
        });

        { window.location.href = "/" }

        return;
    }

    const tabs = [
        { name: "List Your Events", icon: "🎶" },
        { name: "Logout", icon: "🔑" },
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab.name);
        if (tab.name === "Logout") {
            // Handle logout functionality here
            console.log("Logging out...");
        } else if (tab.name === "List Your Events") {

        }
    };

    return (
        <div className="relative position">
            <div className="flex items-center justify-between bg-black p-4 text-white">
                <h1 className="text-2xl font-bold mr-auto text-pink-500">CU LIVE</h1>

                <div className="flex space-x-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`px-6 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 ${activeTab === tab.name
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-800 text-gray-400"
                                }`}
                            onClick={() => handleLogoutClick}
                        >
                            <span>{tab.icon}</span>
                            {tab.name === "List Your Events" ? <Link to={"/events/create"}>{tab.name}</Link> : <span onClick={handleLogoutClick}>{tab.name}</span>}
                        </button>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Navbar;