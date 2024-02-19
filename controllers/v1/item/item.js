const sequelize = require("../../../config/db");
const {item} = require("../../../service/v1")

const itemController = async (req, res, next) => {
  try {
    console.log( req.body)
    return  await new item().getItem(req,res,next);
  } catch (error) {
    next(error);
  }
};
const postitemController = async (req,res,next)=>{
  try{
    return await new item().postItem(req,res,next);
  }
  catch(error)
  {
    next(error)
  }
}
const putitemController=async(req,res,next)=>{
  try{
    return await new item().putItem(req,res,next);
  }
  catch(error)
  {
    next(error)
  }
}
const deleteitemController=async(req,res,next)=>{
  try{
    return await new item().deleteItem(req,res,next);
  }
  catch(error)
  {
    next(error)
  }
}
module.exports = {
  itemController,postitemController,putitemController,deleteitemController
};