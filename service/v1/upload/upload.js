const { ErrorHandler, statusCodes } = require("../../../helper")
const sequelize = require("../../../config/db")
const jwt=require("jsonwebtoken")
const formidable = require("formidable")
    const {QueryTypes} = require("sequelize")
    const path =require("path")
    const bcrypt = require('bcryptjs')
    const fs=require("fs")
const { error } = require("console")
    class Upload {
        constructor() {}
        async uploadFile(req,res,next){
        const options = {
            // Specify desired options here
            uploadDir: __dirname + '/uploads', // Example: Set upload directory
            keepExtensions: true, // Example: Keep file extensions
            maxFileSize: 1 * 1024 * 1024 // Example: Limit file size to 10MB
        };
    
        let form =new formidable.IncomingForm(options);
        form.parse(req);
        form.on("fileBegin",function(name,file){
            if(!["jpg","jpeg","pdf"].includes(file.originalFilename.split(".")[1])){
                throw error("file type not allowed")
            }
            file.filepath=options.uploadDir+"/"+file.originalFilename;
            
        })
        
        form.on("file",function(){

            console.log("uploaded")
            res.status(200).send('file uploaded Successsfully')
        })
 }              
}
module.exports = Upload;