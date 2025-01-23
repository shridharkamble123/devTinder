const mongoose=require("mongoose")


const url=process.env.dataBaseUrl
const connectToDb= async ()=> await mongoose.connect(url)

module.exports=connectToDb