import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSharedDetails, handleUpdateSharedDetails } from "../service/ImageService";

export default function SharedDetails({ userId }) {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchSharedDetails(userId, setDetails, setLoading);
    }, []);

    const handleChange = (index, key, value) => {
        const updatedData = [...details];
        updatedData[index][key] = value;
        setDetails(updatedData);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = details.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(details.length / rowsPerPage);

    return (
        <div className="p-6">
            {loading ? (
         <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        ) : details.length === 0 ? (
            <p className="text-white text-center text-lg font-bold">Nothing Shared</p>
        ) : (
            <>
                <table className="w-full border-collapse border border-red-400">
                    <thead>
                        <tr className="bg-purple-700">
                            <th className="border text-white border-white px-4 py-2">Username</th>
                            <th className="border text-white border-white px-4 py-2">Image Name</th>
                            <th className="border text-white border-white px-4 py-2">Access Type</th>
                            <th className="border text-white border-white px-4 py-2">Revoke Access</th>
                            <th className="border text-white border-white px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="border text-white border-white px-4 py-2">{item.UserName}</td>

                                <td className="border text-white border-white px-4 py-2">
                                    {item.BucketPath.split("/").pop()}
                                </td>

                                <td className="border text-white border-white px-4 py-2">
                                        <select
                                            value={item.IsUpdate}
                                            onChange={(e) =>
                                                handleChange(index, "IsUpdate", e.target.value === "true")
                                            }
                                            className="border bg-green-700 rounded px-2 py-1"
                                        >
                                            <option value="true">Edit Access</option>
                                            <option value="false">View Access</option>
                                        </select>
                                    </td>

                                    <td className="border p-2">
                                        <label className="flex items-center justify-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={item.RevokeAccess === "yes"}
                                                onChange={() =>
                                                    handleChange(index, "RevokeAccess", item.RevokeAccess === "yes" ? "no" : "yes")
                                                }
                                            />
                                            <div
                                                className={`relative w-12 h-6 rounded-full transition ${item.RevokeAccess === "yes" ? "bg-red-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${item.RevokeAccess === "yes" ? "translate-x-6" : "translate-x-0"
                                                        }`}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-sm font-medium">
                                                {item.RevokeAccess === "yes" ? "Yes" : "No"}
                                            </span>
                                        </label>
                                    </td>

                                    <td className="border border-white px-4 py-2">
                                        <button
                                            onClick={() => handleUpdateSharedDetails(details[index], navigate)}
                                            className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-900"
                                        >
                                            Update
                                        </button>
                                    </td>

                                    </tr>
                            ))}
                        </tbody>
                    </table>

                    {details.length > rowsPerPage && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="bg-gray-600 text-white px-3 py-1 mx-2 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-white mx-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="bg-gray-600 text-white px-3 py-1 mx-2 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
         )}
         </div>
     );
 }
 