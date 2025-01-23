const mongoose=require("mongoose")
const {Schema}=mongoose

//Schema
const userSchema= new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String,
        require:true
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
})

//Model
const User=mongoose.model("User",userSchema)

module.exports=User