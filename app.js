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

// app.get('/',(req,res)=>{
//     res.send("Welcome to home page")
// })
// app.get('/',(req,res)=>{
//     res.status(200).json({
//         message : "Welcome to home page."
//     })
// })


app.use(cors(
    {
        origin : 'https://binayak-one.vercel.app'
    }
))
           

app.post('/blog',upload.single('image'),async (req,res)=>{
    const defaultImage = "https://sharedp.com/wp-content/uploads/2024/06/cute-dp-for-girls-cartoon-4k-960x1024.jpg"
    const {title,subtitle,description} = req.body
    let filename;
    if(req.file){
        filename = "https://mern3-node-ds5t.onrender.com/" + req.file.filename
    }else{
        filename = defaultImage
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
        filename = "https://mern3-node-ds5t.onrender.com/" + req.file.filename
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


app.use(express.static('./storage'))


app.listen(process.env.PORT, ()=>{
    console.log("NodeJS project started")
})



// app.listen(3300, ()=>{
//     console.log("NodeJS project has started")
// })