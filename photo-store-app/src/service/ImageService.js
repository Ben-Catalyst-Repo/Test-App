import { toast } from 'react-toastify';

export const fetchImages = async (userId, setImageDetails, setLoading) => {

    try {
        const response = await fetch(`/fetchAllImages?id=${userId}`)
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        data.map((image) => {
            image.object_url = image.object_url + "?responseCacheControl=max-age=3600";
        });

        setTimeout(() => {
            setLoading(false);
        }, 1000);

        setImageDetails(data || []);


    }
    catch (err) {
        console.error(err);
        toast.error("Error Occurred", {
            theme: "colored"
        });
    }

};

export const fetchUsers = async (setUsers) => {
    try {
        const response = await fetch("/getAllUsers");
        const data = await response.json();
        setUsers(data);
    } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error Occurred", {
            theme: "colored"
        });
    }
};

export const handleDelete = async (imageKey, setImageDetails, setOpenMenuIndex, isDelete = true) => {
    try {
        const stratus = window.catalyst.stratus;
        const bucket = stratus.bucket("test-photo-store-app");
        await bucket.deleteObject(imageKey);

        const pathParts = imageKey.split("/");
        const fileName = pathParts.pop();
        const folderName = pathParts.pop();
        const newFileName = fileName.replace(/\.[^/.]+$/, ".jpeg");

        const thumbnailPath = ["photos", "thumbnails", folderName, newFileName].join("/");

        await bucket.deleteObject(thumbnailPath);

        var zcql = window.catalyst.ZCatalystQL;

        var query = `DELETE FROM ImageShareDetails WHERE BucketPath = '${imageKey}'`;

        console.log("QUERY: " + query);

        var zcqlPromise = zcql.executeQuery(query);
        
        await zcqlPromise
            .then((response) => {
                console.log("ZCQL Response: " + JSON.stringify(response.content));
            })
            .catch((err) => {
                console.log("ZCQL Error: " + err);
            });

        setImageDetails(prev => prev.filter(image => image.key !== imageKey));

        if (setOpenMenuIndex != null) {
            setOpenMenuIndex(null);
        }

        toast.success("Image Deleted Successfully", {
            theme: "colored"
        });
    }
    catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Error deleting the file. Please try again.", {
            theme: "colored"
        });
    }
};

export const handleDownload = async (imageKey, setOpenMenuIndex) => {
    try {

        const stratus = window.catalyst.stratus;
        const bucket = stratus.bucket("test-photo-store-app");
        const getObject = await bucket.getObject(imageKey);
        const getObjectStart = getObject.start();

        if (setOpenMenuIndex != null) {
            setOpenMenuIndex(null);
        }

        await getObjectStart.then((blob) => {
            const url = URL.createObjectURL(blob.content);
            const a = document.createElement("a");
            a.href = url;
            a.download = imageKey;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }).catch((error) => {
            console.error("Error downloading file:", error);
        });

        setTimeout(() => {
            toast.success("File Downloaded Successfully", {
                theme: "colored"
            });
        }, 2000);

    }
    catch (error) {
        console.error("Error downloading image:", error);
        toast.error("Error in downloading the file", {
            theme: "colored"
        });
    }
};

export const handleShareAction = async (name, id, path, action, userId) => {
    try {
        const response = await fetch(`/shareDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: name, imagePath: path, zuid: id, isUpdate: action, sharedBy: userId }),
        });

        const data = await response.json();
        if (data.message == "Access Provided") {
            toast.success("Image Shared Successfully", {
                theme: "colored"
            });
        }
        else {
            toast.error(data.message, {
                theme: "colored"
            });
        }
        console.log("API Response:", data);
    } catch (error) {
        console.error("Error calling API:", error);
    }
};


export const fetchSharedImages = async (userId, setImageDetails, setLoading) => {
    try {
        const response = await fetch(`/getSharedImages?id=${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const flattenedImages = data.flatMap(item => item || []);

        setTimeout(() => {
            setLoading(false);
        }, 1000);

        setImageDetails(flattenedImages || []);

    } catch (err) {
        console.error(err);
        toast.error("Error Occurred", {
            theme: "colored"
        });
    }

};

export const fetchSharedDetails = async (userId, setDetails, setLoading) => {
    try {
        const response = await fetch(
            `/getSharedDetails?id=${userId}`
        );
        const data = await response.json();
        setDetails(data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching details:", error);
        setLoading(false);
    }
};

export const handleUpdateSharedDetails = async (updatedItem, navigate) => {
    try {
        const response = await fetch(
            "/updateSharedDetails",
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            }
        );
        await response.json();
        toast.success("Details Updated Successfully", { theme: "colored" });
        navigate(0);
    } catch (error) {
        console.error("Error updating details:", error);
        toast.error("Error updating details", { theme: "colored" });
    }
};
