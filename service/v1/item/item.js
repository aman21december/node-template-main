const { ErrorHandler, statusCodes } = require("../../../helper")
const sequelize = require("../../../config/db")
const {QueryTypes} = require("sequelize")
const  jwt =require('jsonwebtoken')
const {getItems,postItems, putItems,deleteItems}=require('./sqlqueries')
const joi=require("joi")
const userSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  description: joi.string().min(3).max(30).required(),
}); 
class Item {
    constructor() {}
    async validateUser(req, res, next) {
      try {
        const { error } = userSchema.validate(req.body);
        if (error) {
          console.log(error)
          return error;
         //res.status(400).json({ error: error.details[0].message });
        }
      } catch (error) {
        console.error('Error validating user', error);
        // res.status(500).json({ error: 'Internal server error' });
      }
    }
    async authenticateUser(req,res, next) {
        const token = req.header('Token');
        console.log(token)
        if (!token) {
          res.status(401).send('Access denied. No token provided.');
        }
   
        try {
          const decoded =await jwt.verify(token, 'secret-key');
          req.user = decoded;
        } catch (error) {
          res.status(401).send('Invalid token.');
        }
      }
    async getItem(req,res,next){
        try{
            
            console.log(req.header)
            
            this.authenticateUser(req,res,next)
            
            console.log("item services is called");
            const items = await getItems();
           // res.render("getItem.ejs",{result:items[0]})
            res.json(items[0]);
          } 
        catch (err){
            if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
            throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
        }   
    }
    async postItem(req,res,next){
        try{
            console.log("item services are called");
            this.authenticateUser(req,res,next);
            const error=await this.validateUser(req,res,next)
            if(!error){
              postItems(req);
              res.send("item registered")
            }        
            else
            {
              res.send({ error: error.details[0].message })
            }           
          }
        catch (err){
            if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
            throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
        }
    }
    async putItem(req, res,next){
      try{
        console.log("put item called")
        this.authenticateUser(req,res,next)
        const error=await this.validateUser(req,res,next)
        if(!error){
          putItems(req.query.id,req.body)
          res.send("Item Updated")
        }
        else
        {
          res.send({ error: error.details[0].message })
        }        
      }
      catch (err){
        if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
        throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
    }
    }
    async deleteItem(req, res,next){
      try{
        console.log("delete item called")
        this.authenticateUser(req,res,next)
        deleteItems(req.query.id)
        res.send("Item deleted")
      }
      catch (err){
        if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
        throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
    }
    }
}
module.exports = Item;