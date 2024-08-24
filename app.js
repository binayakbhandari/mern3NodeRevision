require('dotenv').config()
const connectDatabase = require("./database")
const express = require('express')

connectDatabase()
const app = express()

// app.get('/',(req,res)=>{
//     res.send("Welcome to home page")
// })
app.get('/', (req,res)=>{
    res.status(200).json({
        message : "API hit successfully"
    })
})




app.listen(process.env.PORT, ()=>{
    console.log("NodeJS project started")
})

// app.listen(3300, ()=>{
//     console.log("NodeJS project has started")
// })