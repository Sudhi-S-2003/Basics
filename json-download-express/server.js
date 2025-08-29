const express=require("express");
const route = require("./csvrouter");

const app=express()
app.use(express.json())
app.use(express.urlencoded())

app.use("/",route)
app.listen(3000,()=>{
    console.log("http://localhost:3000/")
})