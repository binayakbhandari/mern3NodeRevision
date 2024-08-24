require('dotenv').config()
const express = require('express')
const connectDatabase = require("./database")
const Blog = require('./model/blogModel')

connectDatabase()
const app = express()
app.use(express.json())
const {multer,storage} = require('./middleware/multerConfig')
const upload = multer({storage : storage})

// app.get('/',(req,res)=>{
//     res.send("Welcome to home page")
// })
// app.get('/',(req,res)=>{
//     res.status(200).json({
//         message : "Welcome to home page."
//     })
// })


app.post('/blog',upload.single('image'), async (req,res)=>{
    const {title,subtitle,description} = req.body
    let filename;
    if(req.file){
        filename = req.file.filename
    }

    if(!title || !subtitle || !description){
        return res.status(400).json({
            message : "Please enter title, subtitle or description"
        })
    }
    await Blog.create({
        title : title,
        subtitle : subtitle,
        description : description,
        image : filename
    })
    res.status(200).json({
        message : "Blog created successfully"
    })
})

// Read Operation with find() method 
app.get('/blog',async (req,res)=>{
    const blogs = await Blog.find()
    res.status(200).json({
        message : "Blogs fetched successfully",
        data : blogs
    })
})




app.listen(process.env.PORT, ()=>{
    console.log("NodeJS project started")
})

// app.listen(3300, ()=>{
//     console.log("NodeJS project has started")
// })