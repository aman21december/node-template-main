const { ErrorHandler, statusCodes } = require("../../../helper")
const sequelize = require("../../../config/db")
const jwt=require("jsonwebtoken")
const {postUsers}=require("./sqlqueries")
const {getUsers}=require("./sqlqueries")

    const {QueryTypes} = require("sequelize")
    const bcrypt = require('bcryptjs')
    class Auth {
        constructor() {}
  
        async authLogin(body,res){
            try{
                console.log("login services is called")
                const {email, password}=body;
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
                }
            } catch (err){
                if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
                throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
            }
        }
        async authSignup(body,res){
            try{
                console.log("signup services is called")
                const {name, email, password}=body;
                const hashedpassword=await bcrypt.hash(password,10);
                postUsers(name,email,hashedpassword)
                res.send("user registed")
            } catch (err){
                if(err.statusCodes) throw new ErrorHandler(err.statusCodes, err.message)
                throw new ErrorHandler(statusCodes.BAD_GATEWAY, err)
            }
        }
    }
    module.exports = Auth;