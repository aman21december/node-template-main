const express = require("express");
const router = express.Router();

const { dispatcher } = require("../../../middleware");
const { item, postitemController,putitemController,deleteitemController } = require("../../../controllers/v1");

router.post("/",(req,res,next)=>{
    dispatcher(req,res,next,postitemController)
});
router.get("/",(req,res,next)=>{
    dispatcher(req,res,next,item )
})

router.put("/",(req,res,next)=>{
    dispatcher(req,res,next,putitemController )
})
router.delete("/",(req,res,next)=>{
    dispatcher(req,res,next,deleteitemController )
})

module.exports = router;