import ImageThumbnail from '../service/ImageThumbnail';
import { FiDownload, FiTrash2, FiEye, FiEdit, FiChevronRight, FiShare2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


export default function ImageList({
    currentImages,
    openShareIndex,
    handleShareClick,
    users,
    selectedUserIndex,
    toggleUserOptions,
    handleShareAction,
    handleDelete,
    handleDownload,
    setImageDetails,
    openPreview,
    setOpenShareIndex,
    setSelectedUserIndex,
    userId
}) {

    return (
        <div className="flex flex-col space-y-2">
            {currentImages.map((image, index) => (
                <div key={image.key} className={`flex items-center w-full bg-gray-800 p-4 rounded-md 
                    ${openShareIndex === index ? '' : 'transition-transform hover:scale-110'}`}>
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

                    <button
                      className="bg-white p-1 rounded-full shadow-md hover:bg-red-100"
                      onClick={() => handleDelete(image.key, setImageDetails, null)}
                  >
                      <FiTrash2 size={16} className="text-red-600" />
                  </button>

                  <button className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100 mx-1"
                      onClick={(e) => handleShareClick(index, e)}>
                      <FiShare2 size={15} className="text-gray-600" />
                  </button>

                  {openShareIndex === index && users.length > 0 && (
                      <div className="block top-10 right-4 bg-white text-black border rounded shadow-lg w-40 text-sm z-50">
                          {users.map((user, idx) => (
                              <div key={user.id} className="relative">

                                  <button className="flex justify-between items-center w-full text-left text-black px-4 py-2 hover:bg-gray-200"
                                      onClick={(e) => toggleUserOptions(idx, e)}>
                                      {user.name}
                                      <FiChevronRight className="text-gray-600" />
                                  </button>

                                  {selectedUserIndex === idx && (
                                        <div
                                            className="absolute top-0 left-full ml-2 bg-white text-black border rounded shadow-lg w-32 text-sm z-50"
                                            style={{ zIndex: 1000, pointerEvents: "auto" }} // Ensures it's above and interactive
                                        >
                                            <button
                                                className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                                                onMouseEnter={() => document.body.style.pointerEvents = "none"}
                                                onMouseLeave={() => document.body.style.pointerEvents = "auto"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleShareAction(user.name, user.zuid, image.key, false, userId);
                                                    setSelectedUserIndex(null);
                                                    setOpenShareIndex(null);
                                                }}
                                            >
                                                View Access
                                            </button>

                                            <button
                                                className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                                                onMouseEnter={() => document.body.style.pointerEvents = "none"}
                                                onMouseLeave={() => document.body.style.pointerEvents = "auto"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleShareAction(user.name, user.zuid, image.key, true, userId);
                                                    setSelectedUserIndex(null);
                                                    setOpenShareIndex(null);
                                                }}
                                            >
                                                Edit Access
                                            </button>

                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
