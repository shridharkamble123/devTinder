const exprees=require("express");
const dotenv = require('dotenv');
dotenv.config();
const connectToDb = require("./config/databaseConfig");
const User = require("./models/user");
const app = exprees()


app.use(exprees.json())

//create user instance
app.post('/signup',async (req,res)=>{
    try {
        const userData = req.body
        const user=new User(userData)
        await user.save()
        res.send("User added Successfully")
    } catch (error) {
        res.status("400").send("Provide Valid Details"+error)
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

app.patch('/updateUser',async (req,res)=>{
    try {
        const userId = req.body.userId
        const data = req.body
        const userToUpdated = await User.findByIdAndUpdate({_id:userId},data)
        if(!userToUpdated) {
            res.status(404).send("User not found")
        } else {
            res.send("User Updated successfully")
        }
    } catch (error) {
        res.status(404).send("User not found")
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
