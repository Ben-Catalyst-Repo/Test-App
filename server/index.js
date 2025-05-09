'use strict'
const express = require('express');
const path = require('path');
var catalyst = require('zcatalyst-sdk-node');
const multer = require("multer");

const helperFunctions = require('./helper-functions');

const app = express()
const appDir = path.join(__dirname, '../photo-store-app')
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

app.use(express.json());
app.use(express.static(appDir));

const upload = multer({ dest: "uploads/" }); 
 
app.get('/', function (req, res) {
  res.sendFile(path.join(appDir, 'index.html'))
})


app.post("/convertToThumbnailAndUpload", upload.single("image"), async (req, res) => {
    try 
    {
      const obj = catalyst.initialize(req, { scope: 'admin'});
      const stratus = obj.stratus();
      const bucket = stratus.bucket("test-photo-store-app");
      
      console.log("File name: "+req.file.originalname);
      
      const thumbnailName = req.file.originalname.substring(0, req.file.originalname.lastIndexOf(".")) ;
      
      const inputPath = req.file.path; 
      console.log("Input File Path: "+inputPath);
      
      const zuid = req.body.id; 
      console.log("ID: "+zuid);
  
      const thumbnailPath = `photos/thumbnails/${zuid}/`; 
  
      let result;
      
      await helperFunctions.uploadToStratus(bucket,inputPath,thumbnailPath,thumbnailName)
      .then(resp => {
          console.log("Success");
          result = resp;
          res.json({ message: "Thumbnail created and uploaded successfully" });
      })
      .catch(error => {
          console.error("Error: "+JSON.stringify(error.message));
          res.status(500).json({message: "Error Occurred"});
          return;
        })
      } 
      catch (error) 
      {
          console.log("Error in convertToThumbnailAndUpload API: "+error.message);
      }
    });
    
    
    app.get("/fetchAllImages", async (req,res) => {
    
      try 
      {
          console.log("fetchAllImages API STARTED...");
          const obj = catalyst.initialize(req);
          const zuid = req.query.id;
          console.log("ID: "+zuid);
          const objPath = "photos/"+zuid;
          const stratus = obj.stratus();
          const bucket = stratus.bucket("test-photo-store-app");
          var resp = await helperFunctions.listMyObjects(bucket,objPath);
          console.log("fetchAllImages API ENDED...");
          res.json(resp);
      }
      catch(error)
      {
          console.error("Error at fetchAllImages API... ", error.message);
          res.status(500).send({ error: "An error occurred while fetching images."});
      }
    });
    app.get('/getAllUsers', async (req,res) => {
        try
        {
            console.log("getAllUsers API Started");
            const app = catalyst.initialize(req);
            const userManagements = app.userManagement();
            let allUserPromise = userManagements.getAllUsers();
            let currentUserPromise = userManagements.getCurrentUser(); 
            let details;
            let currentUser;
      
            await allUserPromise.then(allUserDetails => 
            {
                details = allUserDetails;
                console.log("All Users: "+JSON.stringify(allUserDetails)); 
            });
      
            await currentUserPromise.then(details => {
              currentUser = details.email_id;
              console.log("Current User: "+currentUser);
            });
      
            const userDetails = details.map(id => ({
                zuid: id.zuid,
                mailId: id.email_id,
                name: id.first_name
            }));
      
            const otherUsers = userDetails.filter(user => user.mailId !== currentUser);
      
            console.log(JSON.stringify("Users: "+JSON.stringify(otherUsers)));
            res.send(otherUsers);
        }
        catch(error)
        {
            console.error("Error in getAllUsers API: "+JSON.stringify(error.message));
            res.status(500).send({ error: "An error occurred while fetching details."});
        }
      
      } );
      
      app.post('/shareDetails',async(req,res) => {
        try
        {
          console.log("shareDetails API started");
          const app = catalyst.initialize(req);
          let zcql = app.zcql();
      
          console.log(`BucketPath = '${req.body.imagePath}' AND UserZuid = '${req.body.zuid}`);
      
          let query = `SELECT COUNT(ImageShareDetails.BucketPath) FROM ImageShareDetails WHERE BucketPath = '${req.body.imagePath}' AND UserZuid = '${req.body.zuid}' `;
      
          let result = await zcql.executeZCQLQuery(query);
          let isPresent = result[0].ImageShareDetails["COUNT(BucketPath)"];
      
          console.log("isPresent: "+isPresent);
      
          if(isPresent == 0)
          {
              let rowData = {
                UserName: req.body.userName, 
                BucketPath: req.body.imagePath, 
                UserZuid: req.body.zuid, 
                IsUpdate: req.body.isUpdate,
                SharedBy: req.body.sharedBy 
            };
            let datastore = app.datastore(); 
            let table = datastore.table('ImageShareDetails'); 
            let insertPromise = table.insertRow(rowData); 
            insertPromise.then((row) => {
                console.log("Inserted Row: "+row); }).catch((err) => {
                  console.error("Error: "+err.message);
                }
                );
            res.json({message:"Access Provided"});
        }
        else
        {
            res.json({message:"Image Already Shared"});
        }
    
      }
      catch(error)
      {
        console.error("Error in shareDetails API: "+error.message);
        res.status(500).send({ message: "Error Occurred" });
      }
    });
    
    app.get('/getSharedImages', async (req,res) => {
      try
      {
      
        console.log("getSharedImages API STARTED...");
        const obj = catalyst.initialize(req);
        const zuid = req.query.id;
        console.log("ID: "+zuid);
        const objPath = "photos/"+zuid;
        const stratus = obj.stratus();
        const bucket = stratus.bucket("test-photo-store-app");
        const zcql = obj.zcql();
        var resp = await helperFunctions.listSharedObjects(bucket,objPath,zcql,zuid);
        console.log("getSharedImages API ENDED...");
        res.json(resp);
      }
      catch(error)
      {
        console.error("Error in getSharedImages API: "+error.message);
        res.status(500).json({message:"Error Occurred"});
      }
    });
    
    app.get('/getSharedDetails', async (req,res) => {
      try
      {
        console.log("getSharedDetails API STARTED...");
        const obj = catalyst.initialize(req);
        const zuid = req.query.id;
        console.log("ID: "+zuid);
        
        let zcql = obj.zcql();
        let query = `SELECT * FROM ImageShareDetails WHERE SharedBy = '${zuid}'`;
        
        let data = await zcql.executeZCQLQuery(query);
    
        const result = data.map(item => ({
            UserName: item.ImageShareDetails.UserName,
            IsUpdate: item.ImageShareDetails.IsUpdate,
            BucketPath: item.ImageShareDetails.BucketPath,
            UserId: item.ImageShareDetails.UserZuid
        }));
    
        console.log("SharedDetails result: "+JSON.stringify(result));
        console.log("getSharedDetails API ENDED...");
        res.send(result);
      }
      catch(error)
      {
        console.error("Error in getSharedDetails API: "+error.message);
        res.status(500).json({message:"Error Occurred"});
      }
    });
    
    app.patch('/updateSharedDetails', async (req,res) => {
      try
      {
        console.log("updateSharedDetails API STARTED...");
        const obj = catalyst.initialize(req);
        const isRevoke = req.body.RevokeAccess;
        const zuid = req.body.UserId;
        const isUpdate = req.body.IsUpdate;
        const bucketPath = req.body.BucketPath;
        
        let zcql = obj.zcql();
        console.log(`ZUID: ${zuid} -- Bucket Path: ${bucketPath} -- isUpdate: ${isUpdate} -- IsRevoke: ${isRevoke}`);
        let query;
        
        if(isRevoke == "yes")
        {
            query = `DELETE FROM ImageShareDetails WHERE UserZuid = '${zuid}' AND BucketPath = '${bucketPath}'`;
    }
    else
    {
        query = `UPDATE ImageShareDetails SET IsUpdate = ${isUpdate} WHERE UserZuid = '${zuid}' AND BucketPath = '${bucketPath}'`;
    }
    
    console.log("QUERY: "+query);
    
    let data = await zcql.executeZCQLQuery(query);
    console.log("Update Details result: "+JSON.stringify(data));
    console.log("updateSharedDetails API ENDED...");
    res.json({message:"Updated Successfully"});
  }
  catch(error)
  {
    console.error("Error in updateSharedDetails API: "+error);
    res.status(500).json({message:"Error Occurred"});
  }
});
 
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 
                          