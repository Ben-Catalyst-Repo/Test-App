import React, { useState, useEffect } from "react";

export default function ImageThumbnail({ imageUrl, listStyle }) {

    console.log("Image URL: "+imageUrl);
    const [thumbnail, setThumbnail] = useState(null);

    const bucketUrl = "https://test-photo-store-app-development.zohostratus.com/";

    const pathParts = imageUrl.split("/"); 
    const fileName = pathParts.pop(); 
    const folderName = pathParts.pop(); 
    const newFileName = fileName.replace(/\.[^/.]+$/, ".jpeg"); 

    const newFilePath = ["photos", "thumbnails", folderName, newFileName].join("/");
    console.log(newFilePath);
    const thumbnailUrl = bucketUrl + newFilePath;

    console.log("ThumbNail URL: "+ thumbnailUrl);

    useEffect(() => {
        setThumbnail(newFilePath);
    }, [imageUrl]);

    return (
        <>
            {thumbnail ? (
                listStyle ? (
                    <img 
                        src={thumbnailUrl} 
                        alt="Thumbnail" 
                        style={{ width: "1rem", height: "1rem" }} 
                    />
                ) : (
                    <img 
                        src={thumbnailUrl} 
                        alt="Thumbnail image" 
                        className="w-40 h-40 object-cover rounded-lg transition-all duration-500 ease-in-out" 
                    />
                )
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
    

}
