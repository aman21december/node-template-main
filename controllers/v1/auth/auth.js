const sequelize = require("../../../config/db");
const {Auth} = require("../../../service/v1")

const login = async (req, res, next) => {
  try {
    return  await new Auth().authLogin(req.body,res);

  } catch (error) {
    next(error);
  }
};
const signup = async (req,res,next) =>{
  try{
    return  await new Auth().authSignup(req.body,res);
    
    } catch (error) {
      next(error);
     }
}
module.exports = {
  login,signup
};
