import mongoose from "mongoose"; 

const UserSchema = mongoose.Schema(
    {
        username : {
            type: String, 
            required : true
        },
        password : {
            type: String,
            required: true
        },
        firstname : {
            type: String,
            required: true
        },
        lastname : {
            type: String,
            required: true
        },
        isAdmin : {
            type: Boolean,
            default : false,
        },
        profilePicture : String , 
        coverPicture : String , 
        about: String,
        livesin: String, 
        worksAt: String, 
        relationship: String,
        country : String,
        followers: [],
        following : []
    },
    {timestamps: true} 
)

// followers ==> how many users follow user1 
// followings ==> how many users user1 follows 


const UserModel = mongoose.model("Users" , UserSchema); 
export default UserModel 