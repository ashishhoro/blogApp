import mongoose from "mongoose";
import { createHmac, randomBytes } from 'crypto';
import {createToken} from '../services/authentication.js';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    salt: {
        type: String,
        // required: true
    },

    password: {
        type: String,
        required: true,
    },

    profileImageUrl: {
        type: String,
        default: "/images/image.png"
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
    
},{timestamps: true});


//pre save for password 
// hash the password with built-in node method crypto
userSchema.pre("save", async function (next){

    const user = this;
    if(!user.isModified("password")) return;

    // basic string
    const salt = randomBytes(16).toString();
    const hashPassword = createHmac("sha256", salt)
                            .update(user.password)
                            .digest("hex");
    this.salt = salt;
    this.password = hashPassword;

    // next();
})

// while login to match password
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({email});
    if(!user) throw new Error("User not Found!");
    ;

    const salt = user.salt;
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

    if(hashedPassword !== user.password)  throw new Error("incorrect Password");

    // return {...user, password:undefined, salt:undefined};
    const token = createToken(user);
    return token;
})

const User = mongoose.model('user', userSchema);

export {User};