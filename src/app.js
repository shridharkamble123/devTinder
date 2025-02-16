const exprees=require("express");
const dotenv = require('dotenv');
dotenv.config();
const connectToDb = require("./config/databaseConfig");
const User = require("./models/user");
const bcrypt = require("bcrypt")
const app = exprees()
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")

app.use(exprees.json())
app.use(cookieParser())
//Register user instance
app.post('/signup',async (req,res)=>{
    try {

        const {firstName,lastName,emailId,password} = req.body
        //password Encryption
        const passwordEncrypted=await bcrypt.hash(password,10)
        console.log(passwordEncrypted);
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordEncrypted
        })
        await user.save()
        res.send("User added Successfully")
    } catch (error) {
        console.log(error.message);
        res.status("400").send("Provide Valid Details"+error)
    }
})

// Login User 

app.post("/login",async(req,res)=>{
    try {
        const {emailId,password}=req.body
        const isUserPresent=await User.findOne({emailId})
        if(!isUserPresent) throw new Error("Invalid Credentials")

        const passWordMatch = await bcrypt.compare(password,isUserPresent.password)
        
        if(!passWordMatch) throw new Error("Invalid Credentials")

        const secretToken=await jwt.sign({userId:isUserPresent._id},"Devtinder@28081998")
        console.log(secretToken,'token');
        res.cookie("token",secretToken)
        res.status(200).send("Login SuccessFull")
    } catch (error) {
        console.log(error.message);
        res.status(403).send("Invalid Credentials")
    }
})


app.get("/profile",async(req,res)=>{
    try {
        
        res.send(findUser)
    } catch (error) {
        res.status(401).send("User unauthorised",error.message)
    }
})


//Get all feed i.e all user

app.get('/feed',async(req,res)=>{
    try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.send("No Records Found")
    }
    
})

//Get user by emailID
app.get('/userByEmail',async (req,res)=>{
    try {
        const emailID=req.body.emailId
        console.log(emailID);
        const user=await User.find({emailId:emailID})
        if(!user.length) throw new Error("User not found")
        res.send(user)
    } catch (error) {
        res.status(404).send("User not found")
    }
})

//Delete User
app.delete('/deleteUser',async (req,res)=>{
    try {
        const userId=req.body.userId
        const user=await User.findByIdAndDelete({_id:userId})
        if(!user) {
            res.status(404).send("User not found")
        } else {
            res.send("User deleted successfully")
        }
    } catch (error) {
        res.status(404).send("User not found")
    }
})

app.patch('/updateUser/:userId',async (req,res)=>{
    try {
        const userId = req.params?.userId
        const data = req.body
       
        const allowedToUpdate=["firstName","lastName","age","gender","about","skills"]
        const isAllowed = Object.keys(data).every((key)=>allowedToUpdate.includes(key))
        if(!isAllowed){
            throw new Error("Some Fields are not allowed to Update")
        }
        const userToUpdated = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true
        })
        if(!userToUpdated) {
            res.status(404).send("User not found")
        } else {
            res.send("User Updated successfully")
        }
    } catch (error) {
        res.status(404).send("Failed to Update "+error.message)
    }
})
connectToDb().then(()=>{
    console.log("Success Fully Connected To Database");
    app.listen(3001,()=>{
        console.log("Server is running on port 3001");
    })
}).catch((err)=>{
    console.log("Error with Database connection",err);
})
