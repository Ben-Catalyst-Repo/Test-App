import ImageThumbnail from '../service/ImageThumbnail';
import { FiDownload, FiTrash2, FiEye, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


export default function SharedImageList(
    { currentImages,
        handleDelete,
        handleDownload,
        setImageDetails,
        openPreview
    }) {
    
    return (
        <div className="flex flex-col space-y-2">
            {currentImages.map((image) => (
                <div key={image.key} className={'flex items-center w-full bg-gray-800 p-4 rounded-md transition-transform hover:scale-110'}>
                    <ImageThumbnail imageUrl={image.object_url} listStyle={1} />

                    <div className="ml-2 flex-1">
                        <p className="text-white text-sm font-medium break-words">{image.key.split('/').pop()}</p>
                    </div>

                    <button
                        className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100 mx-1"
                        onClick={() => openPreview(image.object_url)}
                    >
                        <FiEye size={16} className="text-gray-600" />
                    </button>
                    
                    <button
                        className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100 mx-1"
                        onClick={() => handleDownload(image.key, null)}
                    >
                        <FiDownload size={16} className="text-gray-600" />
                    </button>

                    {image.isEditAccess && (
                        <button
                            className="bg-white p-1 rounded-full shadow-md hover:bg-red-100"
                            onClick={() => handleDelete(image.key, setImageDetails, null)}
                        >
                            <FiTrash2 size={16} className="text-red-600" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
