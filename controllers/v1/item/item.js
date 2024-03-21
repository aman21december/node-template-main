const sequelize = require("../../../config/db");
const {item} = require("../../../service/v1")
const enforcer=require("../../../helper/casbin-enforcer")
const itemController = async (req, res, next) => {
  try {
    const sub = 'alice'; // user
    const obj = 'item'; // resource
    const act = 'write';   // action
  //   (await enforcer).loadPolicy();

  // // Add policies to the enforcer
  // // Example policy format: ["alice", "/data/*", "read"]
  // (await enforcer).addPolicy("alice", "/data/*", "read");

  // // Save the added policies to the adapter
  // (await enforcer).savePolicy();

  // Close the adapter's connection

    (await enforcer).loadPolicy();

    // Retrieve the policy rules from the adapter
    const policies = (await enforcer).getPolicy();
  
    // Log the retrieved policies
    console.log("Policies from the database:");
    console.log(await policies);
    if ((await enforcer).enforce(sub, obj, act)) {
      console.log("hello inside if block")
      console.log('Access granted');
      console.log( req.body)
      return  await new item().getItem(req,res,next);
     
    } else {
      console.log('Access denied');
    }
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