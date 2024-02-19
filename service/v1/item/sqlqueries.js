const mysql = require("mysql2/promise");
const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "demo"
}
const pool = mysql.createPool(config);


async function getItems() {
    console.log("getItems -- function");

    try { 
        const selectQuery = "select * from item";
        const result = await pool.execute(selectQuery);
        return result;
    } catch (err) {
        return err;
    }
}
async function postItems(req){
    console.log("postItem -- function")
    try{
        const query = `insert into item values ("null","${req.body.name}","${req.body.description}")`
        const result = await pool.execute(query);
        return result;
    }
    catch(err){
        return err;
    }
}
async function putItems(id,body)
{
    console.log("putItem --- function")
    try{
        const query = `update item set name="${body.name}",description="${body.description}" where id=${id}`
        const result = await pool.execute(query);
        return result;
    }
    catch(err){
        return err;
    }
}
async function deleteItems(id,body)
{
    console.log("deleteItem --- function")
    try{
        const query = `delete from item where id=${id}`
        const result = await pool.execute(query);
        return result;
    }
    catch(err){
        return err;
    }
}
module.exports = { getItems,postItems,putItems,deleteItems}


