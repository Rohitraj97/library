const express = require("express")
const mongoose = require("mongoose")
const app = express()
app.use(express.json());
const connect = () => {
    return mongoose.connect(
        "mongodb+srv://libraries:libraries123@cluster0.p5gnf.mongodb.net/libraries2?retryWrites=true&w=majority"
    )
}

//Schema

//1. User Schema

const UserSchema =new mongoose.Schema(
    {
        first_name : {type : String, required : true},
        last_name  : {type :String,  requires:true},
    },
    {
        versionKey : false,
        timestamps : true,
    }
)
//1. user model
const User = mongoose.model("user",UserSchema )

//2. Book Schema

const BookSchema = new mongoose.Schema(
    {
        book_name : {type : String, required : true},
        body : {type : String, required: true},
  

    section_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "section",
        required : true
    },

        author_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "author",
            required : true
        
    },

},
    {
        versionKey : false,
        timestamps : true,
    }
)
//Book Schema Model

const Book = new mongoose.model("book", BookSchema)

//3. Aurthor Schema

const AuthorSchema = new mongoose.Schema (
    
        {
            first_name : {type : String, required : true},
            last_name  : {type :String,  requires:true},
        },
        {
            versionKey : false,
            timestamps : true,
        }
    
)

//3.AuthorSchema model

const Author = new mongoose.model("author",AuthorSchema)


//4. SectionSchema

const SectionSchema = new mongoose.Schema (
    {
        name : {type : String, required : true},
    
    book_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "book",
        required : true
    
},
    },
    {
        versionKey : false,
        timestamps : true,
    }
)
//4. Section model
const Section = new mongoose.model("section",SectionSchema)

//5.Author_book

const AuthorbookSchema = new mongoose.Schema (
    {
        book_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "book",
            required : true
        },

        author_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "author",
            required : true
        },
    },
    {
        versionKey : false,
        timestamps : true,
    }
)

const Authorbook= new mongoose.model("author_book",AuthorbookSchema)

     //CRUD


//get for users
app.get("/users",async(req,res) => {
    try{
        const users = await User.find().lean().exec();
        return  res.status(200).send({User:users})
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

//post for users

app.post("/users",async(req,res) => {
    try{
        const users = await User.create(req.body);
        return  res.status(201).send(users)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})


//get for authors

app.get("/authors",async(req,res) => {
    try{
        const authors = await Author.find().lean().exec();
        return  res.status(200).send({Author:authors})
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

//post for author


app.post("/authors",async(req,res) => {
    try{
        const authors = await Author.create(req.body);
        return  res.status(201).send(authors)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

//get for book


app.get("/books",async(req,res) => {
    try{
        const books = await Book.find().lean().exec();
        return  res.status(200).send({Book:books})
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})


//post for book


app.post("/books",async(req,res) => {
    try{
        const books = await Book.create(req.body);
        return  res.status(201).send(books)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})


//get for section
app.get("/sections",async(req,res) =>{
    try{
        const sections = await Section.find().lean().exec();
        return  res.status(200).send({Section:sections})
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})


//post for section

app.post("/sections",async(req,res) =>{
    try{
        const sections = await Section.create(req.body)
        return  res.status(201).send(sections)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

// get for author_book
app.get("/authorbooks",async(req,res) =>{
    try{
        const authorbooks = await  Authorbook.find().lean().exec();
        return  res.status(200).send({ Authorbook:authorbooks})
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

// post for author_book

app.post("/authorbooks",async(req,res) =>{
    try{
        const authorbooks = await  Authorbook.create(req.body)
        return  res.status(201).send(authorbooks)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

//get api of all book written by an author

app.get("/authorbooks/:id",async(req,res) =>{
    try{
        const authorbooks = await  Authorbook.find({author_id:req.params.id}).
        populate({
            path: "book_id",
            select : ["book_name"],
            populate: {path:"section_id",select:["name"]},
            
        })
        
        .lean()
        .exec()
        return  res.status(200).send(authorbooks)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})

app.get("/books/:id",async(req,res) =>{
    try{
        const books = await  Book.find({section_id:req.params.id}) .populate({
       
        
            path: "author_id",
            select : ["first_name"],
            // populate: {path:"section_id",select:["name"]},
        })
            .lean().exec()
            
         
        
       
        return  res.status(200).send( books)
    }
    catch(err)
    {
        return res.status(500).send({message:"something wrong"});
    }
})


 
app.listen(5000,async()=>{
    try{
        await connect()
    }
    
        catch(err)
        {
            console.log(err)
        }
    console.log("listening on port 5000")
})