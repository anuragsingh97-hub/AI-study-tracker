const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.get("/register",(req,res)=>{
    res.render("register");
});

router.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
    const hash = await bcrypt.hash(password,10);
    await User.create({name,email,password:hash});
    res.redirect("/login");
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.send("User not found");

    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.send("Wrong password");

    req.session.userId = user._id;
    res.redirect("/study/dashboard");
});

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
