require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");
const studyRoutes = require("./routes/study");

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use("/",authRoutes);
app.use("/study",studyRoutes);

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
