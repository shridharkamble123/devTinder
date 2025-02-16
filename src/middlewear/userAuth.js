const User = require("../models/user")

const userAuth = async(req,res,next) =>{
    try {
        const {token} = req.cookies
        if(!token) throw new Error("User unauthorised")
        const {userId}=await jwt.verify(token,"Devtinder@28081998")
        const findUser = await User.findById({_id:userId})
        if(!findUser) throw new Error("Unauthorised user")

        next();
    } catch (error) {
        res.status(401).send("User unauthorised",error.message)
    }
}

module.exports=userAuth