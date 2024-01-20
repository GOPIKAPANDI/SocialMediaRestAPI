import express from "express"; 
import { loginUser, registerUser } from "../Controllers/AuthController.js"; 

const router = express.Router() 

// after '/auth'(in search bar) if we have '/'(nothing) then it is executed  [For testing Purpose] 
router.get('/',async(req,res)=>{res.send("Auth Route")}) 

router.post('/register' , registerUser) 
router.post('/login', loginUser)   

export default router 