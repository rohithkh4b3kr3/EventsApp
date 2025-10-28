import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = async (req , res , next) =>{
    try {  
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({message : "Login Required" , success : false});
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
     }
    catch(error){
        return res.status(401).json({message : "Login Required" , success : false});
        console.log("Error in isAuthenticated middleware" , error);
    }
}

export default isAuthenticated;