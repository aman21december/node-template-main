const { ErrorHandler, statusCodes } = require("../../../helper")
const sequelize = require("../../../config/db")
const jwt=require("jsonwebtoken")
const {postUsers}=require("./sqlqueries")
const {getUsers}=require("./sqlqueries")

    const {QueryTypes} = require("sequelize")
    const bcrypt = require('bcryptjs')
    const Joi =require("joi")
    const userSchema = Joi.object({
        password: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
      });
        const userSchema2 = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
    });
  
    class Auth {
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
          async validateUser2(req, res, next) {
            try {
                console.log("hello")
              const { error } = userSchema2.validate(req.body);
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
        async authLogin(req,res,next){
            try{
                console.log("login services is called")
                const error=await this.validateUser(req,res,next)
                if(!error){
                const {email, password}=req.body;
                const result=await getUsers(email,password)
                let bool=false;
                result[0].forEach(function(item){
                    if (item.email==email && bcrypt.compare(password,item.password))
                    {
                        bool=true;
                        const token =jwt.sign({ userId: Math.random }, 'secret-key', { expiresIn: '1h' });
                        console.log(token)
                       // res.status(200).json({ token });
                        res.render("getItem.ejs",{token:token})
                        
                    }
                })
                if(!bool){
                    res.status(404).send("no user found")
                }}
                else{
                      res.send({ error: error.details[0].message })  
                }
            } catch (err){
                if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
                throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
            }
        }
        async authSignup(req,res,next){
            try{
                const error=await this.validateUser2(req,res,next)
                if(!error){
                console.log("signup services is called")          
                const {name, email, password}=req.body;
                const hashedpassword=await bcrypt.hash(password,10);
                postUsers(name,email,hashedpassword)
                res.send("user registed")   
                }
                else{
                    res.send({ error: error.details[0].message })
                }
            } catch (err){
                if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
                throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
            }
        }
    }
    module.exports = Auth;