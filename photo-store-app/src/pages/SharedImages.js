import React, { useState, useEffect } from 'react';
import { FiList, FiGrid, FiX } from "react-icons/fi";
import { fetchSharedImages, handleDelete, handleDownload } from "../service/ImageService";
import SharedImageGrid from './SharedImageGrid';
import SharedImageList from './SharedImageList';


export default function SharedImages({ userId }) {
    const [imageDetails, setImageDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const [viewMode, setViewMode] = useState("grid");

    const imagesPerPage = 9;

    useEffect(() => {
        fetchSharedImages(userId, setImageDetails, setLoading);
    }, [userId]);

    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = imageDetails.slice(indexOfFirstImage, indexOfLastImage);

    const nextPage = () => {
        if (indexOfLastImage < imageDetails.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleMenu = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const openPreview = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closePreview = () => {
        setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center p-6 relative">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (

                <>
                   {imageDetails.length == 0 ? (
                        <>
                            <div className="flex items-center justify-center h-screen">
                                <p className="text-white text-lg font-semibold text-center">
                                    No Shared files found.
                                </p>
                            </div>
                        </>
                    ) :
                        (
                            <>

                                <button className="absolute top-4 right-4 bg-blue-700 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2"
                                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                >
                                    {viewMode === "grid" ? <FiList size={20} /> : <FiGrid size={20} />}
                                </button>

                                <div className="max-w-screen-lg w-full mt-12">
                                    {viewMode === "grid" ? (
                                        <SharedImageGrid
                                            currentImages={currentImages}
                                            toggleMenu={toggleMenu}
                                            handleDelete={handleDelete}
                                            handleDownload={handleDownload}
                                            setImageDetails={setImageDetails}
                                            setOpenMenuIndex={setOpenMenuIndex}
                                            openMenuIndex={openMenuIndex}
                                            openPreview={openPreview}
                                        />
                                    ) : (
                                        <SharedImageList
                                            currentImages={currentImages}
                                            handleDelete={handleDelete}
                                            handleDownload={handleDownload}
                                            setImageDetails={setImageDetails}
                                            openPreview={openPreview}
                                        />
                                    )}
                                </div>

                                {imageDetails.length > imagesPerPage && (
                                    <div className="flex mt-6 justify-center items-center space-x-4">
                                        <button onClick={prevPage}
                                            disabled={currentPage === 1} className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50 disabled:bg-blue-200">
                                            Previous
                                            </button>
                                        <span className="text-lg font-semibold text-center w-20">Page {currentPage}</span>
                                        <button onClick={nextPage} disabled={indexOfLastImage >= imageDetails.length} className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50 disabled:bg-blue-200">
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                </>
            )}

            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                            onClick={closePreview}
                        >
                            <FiX size={20} className="text-gray-600" />
                        </button>

                        <img src={selectedImage} alt="Preview" className="max-w-full max-h-[50vh] rounded-lg shadow-lg" />
                    </div>
                </div>
            )}

</div>
    );
}
