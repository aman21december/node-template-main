const { ErrorHandler, statusCodes } = require("../../../helper")
const sequelize = require("../../../config/db")
const {QueryTypes} = require("sequelize")
const  jwt =require('jsonwebtoken')
const enfo=require("../../../helper/casbin-enforcer")
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
          return req.user.role;
        } catch (error) {
          res.status(401).send('Invalid token.');
        }
      }
    async getItem(req,res,next){
        try{
            let fullUrl =  req.originalUrl;
            console.log(fullUrl)
  
              console.log("item services are called");
              const role=await this.authenticateUser(req,res,next);
              const sub = role; // user
              const obj = fullUrl; // resource
              const act = req.method; 
              console.log(sub,obj,act)
              const enforcer = await enfo;
              if (await enforcer.enforce(sub, obj, act)) {
                console.log('Access granted');
                const items = await getItems();
                 res.json(items[0]);
              }
              else{
                console.log("Access Denied")
              }
          } 
        catch (err){
            if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
            throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
        }   
    }
    async postItem(req,res,next){
        try{
          let fullUrl =  req.originalUrl;
          console.log(fullUrl)

            console.log("item services are called");
            const role=await this.authenticateUser(req,res,next);
            const sub = role; // user
            const obj = fullUrl; // resource
            const act = req.method; 
            console.log(sub,obj,act)
            const enforcer = await enfo; 
            await enforcer.loadPolicy();

            // Retrieve the policy rules from the adapter
            const policies = await enforcer.getPolicy();
          
            // Log the retrieved policies
            console.log("Policies from the database:");
            console.log(policies);
            if (await enforcer.enforce(sub, obj, act)) {
              console.log('Access granted');
              const error=await this.validateUser(req,res,next)
              if(!error){
                postItems(req);
                res.send("item registered")
              }        
              else
              {
                res.send({ error: error.details[0].message })
              }          
            } else {
              console.log('Access denied');
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
        let fullUrl =  req.originalUrl;
        const role=await this.authenticateUser(req,res,next);
        const sub = role; // user
        const obj = fullUrl.split("?")[0]; ; // resource
        const act = req.method
        console.log(sub,obj,act)
        const enforcer = await enfo; 
        if (await enforcer.enforce(sub, obj, act)) {
          console.log('Access granted');
          const error=await this.validateUser(req,res,next)
        if(!error){
          putItems(req.query.id,req.body)
          res.send("Item Updated")
        }
        else
        {
          res.send({ error: error.details[0].message })
        }
      } else {
        console.log('Access denied');
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
        let fullUrl =  req.originalUrl;
        const role=await this.authenticateUser(req,res,next);
        const sub = role; // user
        const obj = fullUrl.split("?")[0]; ; // resource
        const act = req.method
        console.log(sub,obj,act)
        const enforcer = await enfo;
        if (await enforcer.enforce(sub, obj, act)) {
          console.log('Access granted'); 
          deleteItems(req.query.id)
          res.send("Item deleted")
        }
        else {
          console.log('Access denied');
        }
      }
      catch (err){
        if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
        throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
    }
    }
}
module.exports = Item;