// server.js
const express = require("express");
var mongoose = require('mongoose');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const app = express();
const cors = require("cors");
const path = require('path'); 
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
const User = require('./models/user');
const user = require("./models/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend')));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
mongoose.connect('mongodb://localhost:27017/codersadda', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('DB Connected')
).catch((err)=>{
    console.log('DB connection Error Happend'+ err);
})


// var articleSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         default: 'No Name'
//     },
//     photos: {
//         type: Buffer,
//         contentType: String
//     }
    
// })

//Points: it is not ideal to store photos directly in mongodb, most of the time there are need of uploading
//multiple photos or files not just single
app.post("/upload_files", upload.array("files"), async function uploadFiles(req, res) {
    var paths = req.files.map(file => console.log(file.path));
    console.log(paths);
    console.log(req.body.name);
    console.log("-----");
    console.log(req.files);
    console.log("--Total Files Sent--");
    console.log(req.files.length);
    
  //  console.log("BODY: "+ req.body);
  //  console.log("FILES: "+req.files);
    var pathss = req.files.map(file => console.log(file.path));
    const result = [{}];
    for (var i = 0; i < req.files.length; i++) {
        var locaFilePath = req.files[i].path;

        // Upload the local image to Cloudinary
        // and get image url as response
        var eachfileres = await uploadToCloudinary(locaFilePath);
        result.push(eachfileres.url);
    }
    // var paths = req.files.map(file => {
    //     const eachfileres = await uploadToCloudinary(file.path);
    //     result.push(eachfileres);
    // });
    
    result.splice(0,1);
    console.log(result);
    let incomingname= req.body.name;
    user.insertMany({name: incomingname, photoUrls: result}, (err, savedResult)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Result Saved in DB");
        }
    })
//    res.redirect('http://localhost:5000/');
    //res.json(result);
    
    //res.json({ message: "Successfully uploaded files" });
}
);


async function uploadToCloudinary(filePath){
    return cloudinary.uploader.upload(filePath)
    .then((result) => {
        return {
            url: result.url
        }
    }).catch((err)=>{
        console.log(err);
    })
}
app.get('/form', (req, res)=>{
    res.render('/frontend/index.html');
})
app.get('*', (req, res)=>{
    res.send('Home Page');
})

app.listen(5000, () => {
    console.log(`Server started...`);
});


