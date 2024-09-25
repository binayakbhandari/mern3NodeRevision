require('dotenv').config()
const express = require('express')
const connectDatabase = require("./database")
const Blog = require('./model/blogModel')

connectDatabase()
const app = express()
app.use(express.json())
const {multer,storage} = require('./middleware/multerConfig')
const upload = multer({storage : storage})
const fs = require('fs')
const cors = require('cors')

app.get('/',(req,res)=>{
    res.send("Welcome to home page")
})
// app.get('/',(req,res)=>{
//     res.status(200).json({
//         message : "Welcome to home page."
//     })
// })


app.use(cors(
    {
        origin : "http://localhost:5173"
    }
))


app.post('/blog',upload.single('image'),async (req,res)=>{
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

// Single read operation with findById() method
app.get('/blog/:id',async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)

    if(!blog){
        return res.status(404).json({
            message : "No data found"
        })
    }
    res.status(200).json({
        message : "Blog fetched successfully",
        data : blog
    })
})

// Delete operation
app.delete("/blog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await Blog.findById(id)
    const imageName = blog.image

    if(imageName){
        fs.unlink(`storage/${imageName}`, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("File deleted successfully")
            }
        })
    }else{
        console.log("File not found in this blog")
    }

    await Blog.findByIdAndDelete(id)
    res.status(200).json({
        message: "Blog deleted successfully"
    })
})

// Update operation
app.patch("/blog/:id",upload.single('image'),async (req,res)=>{
    const id = req.params.id
    const {title,subtitle,description} = req.body
    let filename;
    if(req.file){
        filename = req.file.filename
        const blog = await Blog.findById(id)
        const imageName = blog.image

        fs.unlink(`storage/${imageName}`, (err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("File deleted successfully")
            }
        })
    }

    await Blog.findByIdAndUpdate(id,{
        title : title,
        subtitle : subtitle,
        description : description,
        image : filename
    })
    res.status(200).json({
        message : "Blog updated successfully"
    })
})




app.listen(process.env.PORT, ()=>{
    console.log("NodeJS project started")
})

// app.listen(3300, ()=>{
//     console.log("NodeJS project has started")
// })