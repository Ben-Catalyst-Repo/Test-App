import ImageThumbnail from "../service/ImageThumbnail";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";


export default function SharedImageGrid({ currentImages,
    toggleMenu,
    handleDelete,
    handleDownload,
    setImageDetails,
    setOpenMenuIndex,
    openMenuIndex,
    openPreview
}) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {currentImages.map((image, index) => (
                <div key={image.key} className="flex flex-col items-center w-full max-w-xs relative cursor-pointer transition-transform hover:scale-110"
                    onClick={() => openPreview(image.object_url)}>
                    <div className="max-w-xs h-auto flex items-center justify-center bg-gray-200 rounded-lg shadow-lg relative">

                        <ImageThumbnail imageUrl={image.object_url} />

                        <button
                            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                            onClick={(e) => toggleMenu(index, e)}
                        >
                            <FiMoreVertical size={15} className="text-gray-600" />
                        </button>

                        {openMenuIndex === index && (
                            <div className="absolute bottom-10 right-2 text-blue-600 bg-white border rounded shadow-lg w-32 text-sm z-50">
                                {image.isEditAccess && (
                                    <>                                        
                                        <button
                                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDelete(image.key, setImageDetails, setOpenMenuIndex);
                                            }}
                                        >
                                            Delete
                                        </button>
                                        </>
                                )}

                                <button
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDownload(image.key, setOpenMenuIndex);
                                    }}
                                >
                                    Download
                                </button>

                            </div>
                        )}
                    </div>
                    <div className="w-full max-w-xs mt-3">
                        <p className="text-xl font-medium text-white text-center break-words">
                            {image.key.split('/').pop()}
                        </p>
                    </div>

                </div>
            ))}

        </div>
    );
}
