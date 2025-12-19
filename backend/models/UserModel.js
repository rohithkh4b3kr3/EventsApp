import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    username : {type: String, required: true, unique: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true , select: false},
    createdAt : {type: Date, default: Date.now} ,
    followers : [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following : [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    userType: { type: String, enum: ['user', 'club'], default: 'user' },
    clubName: { type: String }, // Only for clubs

} ,{ timestamps: true } );

const User = mongoose.model("User" , userSchema);

export default User;