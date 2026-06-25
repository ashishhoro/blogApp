import express from "express";
import path from "path";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js"
import blogRoute from "./routes/blog.route.js";
import { chechForAuthenticationCookie } from "./middlewares/auth.middleware.js";
import { Blog } from "./models/blog.model.js";


const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

app.use(chechForAuthenticationCookie("token"))

const connectDB = async () => {
try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("Local mongodb connected successfully...")
} catch (error) {
    console.log(error)   
}}

connectDB();

app.get('/', async (req, res) => { 
    const allBlogs = await Blog.find({}).sort({"createdAt": -1});
    
    return res.render("home", {
    user: req.user,
    blogs: allBlogs
})});
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen( process.env.PORT, () => console.log(`The Server is running at PORT ${process.env.PORT}`))