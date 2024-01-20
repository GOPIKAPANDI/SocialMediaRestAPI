import UserModel from "../Models/userModel.js";  
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// get all users
export const getAllUsers = async(req,res)=>{
    try {
        let users = await UserModel.find()
        users = users.map((user)=>{
            const {password , ...otherDetails} = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a User 
export const getUser = async(req,res)=>{
    const id = req.params.id; 
    try {
        const user = await UserModel.findById(id);  
        if(user){
            const {password , ...otherDetails} = user._doc 
            res.status(200).json(otherDetails)  
        } 
        else {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// update user 
export const updateUser = async(req,res) => {
    const id = req.params.id; 
    const {_id , currentUserAdminStatus , password} = req.body;   
    // only user1 and admin can update user1's details 
    if(id=== _id){ 
        try {                     
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password,salt);   
            }
            const user = await UserModel.findByIdAndUpdate(id , req.body ,{new: true,}) 
            const token = jwt.sign(
                {username : user.username , id: user._id},
                process.env.JWT_KEY,
                {expiresIn: "1h"}
            )
            res.status(200).json({user,token}); 
        }  
        catch (error) {
            res.status(500).json(error); 
        }
    }
    else{
        res.status(403).json("Access Denied! You can only update your own profile "); 
    }
}   

// delete user 
export const deleteUser = async(req,res) => { 
    const id = req.params.id;
    const {currentUserId , currentUserAdminStatus} = req.body; 
    if(currentUserId === id || currentUserAdminStatus) 
    {
        try {
                const user = await UserModel.findByIdAndDelete(id);
                console.log(user);
                res.status(200).json("User deleted successfully");  
        } catch (error) {
            console.log(error);
            res.status(500).json(error); 
        }
    }
    else{
        res.status(403).json("Access Denied! You can only delete your own profile")
    }
}

// Follow a User 

export const followUser = async(req , res) => { 
    // User to be followed (Angela Yu)
    const id = req.params.id;    
    
    // Who wants to follow (Me) 
    const {_id} = req.body; 
    let currentUserId = _id;

    if(currentUserId === id){
        res.status(403).json("Action forbidden : You cannot follow yourself") 
    } 
    else{
        try {
            const followUser = await UserModel.findById(id) 
            const followingUser = await UserModel.findById(currentUserId) 

            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push : {followers : currentUserId }}) 
                await followingUser.updateOne({$push : {following : id}}) 
                res.status(200).json("User followed!")
            } 
            else{
                res.status(403).json("User is already followed by you") 
            }
        } catch (error) {
            res.status(500).json(error); 
        }
    }

}

// Unfollow user 
export const unFollowUser = async(req , res) => { 
    // User to be Unfollowed (Angela Yu)
    const id = req.params.id;   

    // Who wants to Unfollow that user (Me) 
    const {_id} = req.body; 
    let currentUserId = _id;

    if(currentUserId === id){
        res.status(403).json("Action forbidden : You cannot unfollow yourself") 
    } 
    else{
        try {
            const followUser = await UserModel.findById(id) 
            const followingUser = await UserModel.findById(currentUserId) 

            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull : {followers : currentUserId }}) 
                await followingUser.updateOne({$pull : {following : id}}) 
                res.status(200).json("User Unfollowed!")
            } 
            else{
                res.status(403).json("User is not followed by you") 
            }
        } catch (error) {
            res.status(500).json(error); 
        }
    }

}

