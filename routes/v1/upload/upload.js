const express = require("express");
const router = express.Router();

const { dispatcher } = require("../../../middleware");
const { uploaditemController } = require("../../../controllers/v1");

router.post("/",(req,res,next)=>{
    dispatcher(req,res,next,uploaditemController)
});


module.exports = router;