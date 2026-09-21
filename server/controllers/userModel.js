import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    Password: {type:String, required: true},
    CartData: {type:Object, default:{}},
}, {minimize:false})

const userModel = mongoose.model.user || mongoose.model('user', userSchema)

export default userModel