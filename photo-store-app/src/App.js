import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Upload from "./pages/Upload";
import "./App.css";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import { ToastContainer } from 'react-toastify';
import { Turn as Hamburger } from 'hamburger-react';
import SharedDetails from "./pages/SharedDetails";
import Home from "./pages/Home";
import SharedImages from "./pages/SharedImages";

function HeaderClick() {
    const navigate = useNavigate();
    return (
        <h1
            className="text-2xl font-bold px-4 cursor-pointer hover:text-gray-300 transition duration-300"
            onClick={() => navigate("/")}
        >
            Photo Store App
        </h1>
    );
}

function App() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [userId, setUserId] = useState(null);
    const [isOpen, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const result = await window.catalyst.auth.isUserAuthenticated();
                setUserId(result.content.zuid);
                setIsUserAuthenticated(true);
            } catch (err) {
                console.log("UNAUTHENTICATED");
            } finally {
                setIsFetching(false);
            }
        };
        authenticateUser();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden">
            <nav className="flex justify-between items-center px-6 py-4 shadow-lg relative">
                <div className="flex items-center relative">
                    <Hamburger toggled={isOpen} toggle={setOpen} />
                    {isOpen && (
                        <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white w-64 h-screen shadow-lg p-4 z-50 overflow-y-auto flex flex-col justify-between text-lg">
                            <ul className="flex flex-col space-y-4">
                                <li className="py-2 px-4 cursor-pointer hover:bg-blue-700" onClick={() => { setOpen(false); navigate("/upload"); }}>Upload Image</li>
                                <li className="py-2 px-4 cursor-pointer hover:bg-blue-700" onClick={() => { setOpen(false); navigate("/"); }}>Your Gallery</li>
                                <li className="py-2 px-4 cursor-pointer hover:bg-blue-700" onClick={() => { setOpen(false); navigate("/sharedImages"); }}>Shared Gallery</li>
                                <li className="py-2 px-4 cursor-pointer hover:bg-blue-700" onClick={() => { setOpen(false); navigate("/sharedDetails"); }}>Manage Shared Details</li>
                            </ul>
                            <ul className="pb-16 mt-auto">
                                <li className="py-2 px-4 cursor-pointer hover:bg-red-700" onClick={() => { setOpen(false); navigate("/logout"); }}>LogOut</li>
                            </ul>
                        </div>
                    )}
                    <HeaderClick />
                    </div>
                <ul className="flex space-x-32">
                    <li>
                        <button onClick={() => navigate("/upload")}
                            className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition duration-300">
                            Upload
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="flex-grow flex justify-center items-center overflow-hidden">
                {isFetching ? (
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                ) : isUserAuthenticated ? (
                    <Routes>
                        <Route path="/upload" element={<Upload userId={userId} />} />
                        <Route path="/sharedDetails" element={<SharedDetails userId={userId} />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/" element={<Home userId={userId} />} />
                        <Route path="/sharedImages" element={<SharedImages userId={userId} />} />
                        <Route path="*" element={<Home userId={userId} />} />
                    </Routes>
                ) : (
                    <Login />
                )}
            </div>

            <ToastContainer />
        </div>
    );
}

export default App;
