const sequelize = require("../../../config/db");
const {Upload} = require("../../../service/v1")

const uploaditemController = async (req, res, next) => {
  try {
    return  await new Upload().uploadFile(req,res,next);
  } catch (error) {
    next(error);
  }
};
module.exports = {
    uploaditemController,
  };