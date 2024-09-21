const express = require('express')
const mongoose=require('mongoose')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors=require('cors')
const dotEnv=require('dotenv')
const userModel=require('./models/userModel')
const foodModel=require('./models/foodModel')
const verifyToken=require('./verifyToken')
const trackingModel=require('./models/trackingModel')
dotEnv.config()
const PORT=process.env.PORT
console.log(PORT)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.log(err,"Some error occur while connecting the database")
})

const app=express()
app.use(express.json())
app.use(cors())

//endpoint for registering user
app.post("/register",(req,res)=>
{
    let user=req.body;
    bcrypt.genSalt(10,(err,salt)=>
    {
        if(!err)
        {
            bcrypt.hash(user.password,salt,async(err,hpass)=>{
                if(!err)
                {
                    user.password=hpass
                    try{
                        let doc = await userModel.create(user)
                        res.status(201).send({message:"User Register"})
                    }catch(err){
                        console.log(err)
                        res.status(500).send({message:"Some internal server error occur"})
                    }
                }
            })
        }
    })
})

//endpoint for login
app.post("/login",async(req,res)=>{
    let userCred=req.body
    const user = await userModel.findOne({email:userCred.email})
    
    try{
        if(user!==null){
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success==true){
                    jwt.sign({email:userCred.email},process.env.SECRET_KEY,(err,token)=>{ //here nutrifyapp is our secret key
                        if(!err){
                            res.status(200).send({message:"Login Success",token:token,name:user.name,userid:user._id})
                        }else{
                            res.status(500).send({message:"Some internal server occur"})
                        }
                    })
                }else{
                    res.status(401).send({message:'Incorrect password'})
                }
            })
        }else{
            res.status(404).send({message:"Email not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:"some internal server occur"})
    }
})

//endpoint to get all the food items
app.get("/foods",verifyToken,async(req,res)=>{
    
    try{
        let foods=await foodModel.find()
        res.status(200).send(foods)

    }catch(err){
        console.log("some problem while getting foods data")
        res.status(500).send({message:"Some internal server occur"})
    }
})

// endpoint to search food by name
app.get('/foods/:name',verifyToken,async(req,res)=>{
    try{
        let foods=await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
        if(foods.length!==0){
            res.send(foods)
        }else{
            res.status(404).send({message:"Food Item Not Found"})
        }
    }catch(err)
    {
        console.log(err);
    }
})

// endpoint to track food
app.post("/track",verifyToken,async(req,res)=>{
    let trackData=req.body;
    try{
        let data = await trackingModel.create(trackData)
        res.status(201).send({message:"Food Added",data:data})
    }catch(err){
        console.log(err)
        res.status(500).send({message:"Some problem occur"})
    }
})

//endpoint to fetch all the food eaten by a person
app.get("/track/:userid/:date",async(req,res)=>{
    let userid=req.params.userid;
    let date=new Date(req.params.date)
    let strDate=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    console.log(strDate)
    try{
        let foods=await trackingModel.find({userId:userid,eatenDate:strDate}).populate('userId').populate('foodId')
        res.send(foods)
    }catch(err){
        res.status(500).send({message:"error occurs"})
    }
})

app.listen(PORT,()=>{
    console.log("server is up and running")
})