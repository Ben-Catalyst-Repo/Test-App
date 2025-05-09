import React from "react";
import { FiShare2, FiChevronRight, FiMoreVertical } from "react-icons/fi";
import ImageThumbnail from "../service/ImageThumbnail";
import { useNavigate } from "react-router-dom";

export default function ImageGrid({

  currentImages,
  openShareIndex,
  handleShareClick,
  users,
  selectedUserIndex,
  toggleUserOptions,
  handleShareAction,
  openPreview,
  openMenuIndex,
  toggleMenu,
  handleDelete,
  handleDownload,
  setImageDetails,
  setOpenMenuIndex,
  setOpenShareIndex,
  setSelectedUserIndex,
  userId

}) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
      {currentImages.map((image, index) => (
        <div
          key={image.key}
          className={`flex flex-col items-center w-full max-w-xs relative cursor-pointer ${openShareIndex === index ? "" : "transition-transform hover:scale-110"
            }`}
          onClick={() => openPreview(image.object_url)}
        >
          <div className="max-w-xs h-auto flex items-center justify-center bg-gray-200 rounded-lg shadow-lg relative">

            <button
              className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={(e) => handleShareClick(index, e)}
            >
              <FiShare2 size={15} className="text-gray-600" />
            </button>

            {openShareIndex === index && users.length > 0 && (
              <div className="absolute top-10 left-2 bg-white text-black border rounded shadow-lg w-40 text-sm z-50">
                {users.map((user, idx) => (
                  <div key={user.id} className="relative">

<button
                      className="flex justify-between items-center w-full text-left text-black px-4 py-2 hover:bg-gray-200"
                      onClick={(e) => toggleUserOptions(idx, e)}
                    >
                      {user.name}
                      <FiChevronRight className="text-gray-600" />
                    </button>

                    {selectedUserIndex === idx && (
                      <div
                        className="absolute top-0 left-full ml-2 bg-white text-black border rounded shadow-lg w-32 text-sm z-50"
                        style={{ zIndex: 1000, pointerEvents: "auto" }}
                      >
                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-200"
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
                          className="block w-full px-4 py-2text-left hover:bg-gray-200"
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

            <ImageThumbnail imageUrl={image.object_url} />

            <button
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={(e) => toggleMenu(index, e)}
            >
              <FiMoreVertical size={15} className="text-gray-600" />
            </button>

            {openMenuIndex === index && (
              <div className="absolute bottom-10 right-2 text-blue-600 bg-white border rounded shadow-lg w-32 text-sm z-50">
                
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

            </div>
          )}
        </div>

        <div className="w-full max-w-xs mt-3">
          <p className="text-xl font-medium text-white text-center break-words">
            {image.key.split("/").pop()}
          </p>
        </div>

      </div>
  ))}

  </div>
);
};
