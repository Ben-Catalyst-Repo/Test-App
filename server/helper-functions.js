const sharp = require("sharp");

async function listMyObjects(bucket, prefix, isEdit = true) {
    try
    {
        console.log("listMyObjects method STARTED...");
        
        const objects = await bucket.listPagedObjects({prefix:prefix});
    
        console.log("objects :", objects)

        let result = [];

        for(let i = 0; i < objects.contents.length; i++)
        {
             const imgInfo = {
                key: objects.contents[i].objectDetails.key,
                object_url: objects.contents[i].objectDetails.object_url,
                isEditAccess: isEdit
            }

            result.push(imgInfo)
        }
        
        console.log("listMyObjects method ENDED...");

        return result;
    }
    
    catch(error)
    {
        console.error("Error at listMyObjects function: "+error);
    }
}

async function uploadToStratus(bucket,inputPath,thumbnailPath,thumbnailName)
{
   try
   {
       console.log("uploadToStratus method Started");
       const streamData = await sharp(inputPath)
                   .resize({ width: 150, height: 150 })  
                   .toFormat("jpeg", { quality: 70 }) 
                   .toBuffer();
       console.log("ThumbnailPath: "+thumbnailPath);
       console.log("ThumbnailName: "+thumbnailName);
       const result = await bucket.putObject(thumbnailPath + thumbnailName + ".jpeg", streamData);
       console.log("uploadToStratus method Completed");
       return result;
   }
   catch(error)
   {
       console.error("Error Occurred..."+JSON.stringify(error));
       throw { message: "Error in uploading", code: 500 };

   }
}

async function listSharedObjects(bucket, prefix, zcql,zuid) {
   try
   {
       let query = `SELECT * FROM ImageShareDetails WHERE UserZuid = ${zuid}`;
       let result = await zcql.executeZCQLQuery(query);
        console.log("Query Result: "+JSON.stringify(result));
        
        const queryData = result.map(item => ({
            path: item.ImageShareDetails.BucketPath,
            isEdit: item.ImageShareDetails.IsUpdate
        }));

        console.log("Query Data: "+JSON.stringify(queryData));

        let allSharedImages = [];

        for (const item of queryData) {
            const result = await listMyObjects(bucket, item.path, item.isEdit);
            allSharedImages.push(result);
        }

        console.log("ALL Images: "+allSharedImages);
        return allSharedImages;
    }
    catch(error)
    {
        console.error("Error Occurred..."+error.message);
    }

}


 module.exports = {
    listMyObjects,
    uploadToStratus,
    listSharedObjects
 };
