const express = require("express");
const router = express.Router();

const { dispatcher } = require("../../../middleware");
const { login } = require("../../../controllers/v1");
const { signup } = require("../../../controllers/v1");
router.post("/login", (req, res, next) =>
    dispatcher(req, res, next, login)
);
router.post("/signup",(req,res,next)=>{
    dispatcher(req,res,next,signup)
});


module.exports = router;
