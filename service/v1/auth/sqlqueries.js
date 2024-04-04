const mysql = require("mysql2/promise");
const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "demo"
}
const pool = mysql.createPool(config);


async function getUsers() {
    console.log("getUsers -- function");

    try { 
        const selectQuery = "select * from signup";
        const result = await pool.execute(selectQuery);
        return result;
    } catch (err) {
    }
}
async function postUsers(name,email,password,role){
    console.log("postUser -- function")
    try{
        const query = `insert into signup values ("null","${name}","${email}","${password}","${role}")`
        const result = await pool.execute(query);
        return result;
    }
    catch(err){
        return err;
    }
}


module.exports = { getUsers,postUsers}


