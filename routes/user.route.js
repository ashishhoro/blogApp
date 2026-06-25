import {Router} from "express";
import { User } from "../models/user.model.js";

const router = Router();

router.get("/signup", (req, res) => {
    return res.render("signup");
})

router.get("/signin", (req, res) => {
    return res.render("signin");
})
router.get("/logout", (req,res) => {
    return res.clearCookie("token").redirect("/");
})

router.post("/signup", async(req, res) => {
    const {fullName, email, password} = req.body;
    const user = await User.create({
        fullName, email, password
    });

    if(!user) return res.redirect("signup");

    return res.redirect("signin");
})

router.post("/signin", async(req, res) => {
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(
            email, password
        );
        // console.log("Token: ", token);
    
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.log(error);
        
        return res.render("signin", {
            error: "Incorrect Email or Password !!!"
        });
    }
})

export default router;
