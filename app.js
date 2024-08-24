require('dotenv').config()
const express = require('express')
const connectDatabase = require("./database")
const Blog = require('./model/blogModel')

connectDatabase()
const app = express()
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.send("Welcome to home page")
// })
// app.get('/',(req,res)=>{
//     res.status(200).json({
//         message : "Welcome to home page."
//     })
// })


app.post('/blog',async (req,res)=>{
    const {title,subtitle,description,image} = req.body
    await Blog.create({
        title : title,
        subtitle : subtitle,
        description : description,
        image : image
    })
    res.status(200).json({
        message : "Blog created successfully"
    })
})





app.listen(process.env.PORT, ()=>{
    console.log("NodeJS project started")
})

// app.listen(3300, ()=>{
//     console.log("NodeJS project has started")
// })