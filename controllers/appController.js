// const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");


const landing_page = (req,res) => {
    res.render("landing");
};



const login_get = (req,res)=>{
    res.render("login");
};

const login_post =  async(req,res) => {
    const {email, password} = req.body;
    
    const user = await userModel.findOne({email}); // Retrieve a single document that matches email.
    // console.log(user);

    if(!user){
        res.write("<h1>No user under this Email</h1>");
        res.write("<a href='/register'>Register</a>");
        res.end();
        return;
    }

    // const hasdPsw = await bcrypt.hash(password, 10);
    const isMatch = await (user.password == password);
    // console.log(isMatch);
    

    if(!isMatch){
        res.write("<h1>Invalid Password!</h1>");
        res.write("<a href='/login'>Login</a>");
        res.end();
        return;
    }

    req.session.isAuth = true;
    res.redirect("/dashboard");

};



const register_get =  (req,res)=>{
    res.render("register");
};

const register_post =  async(req,res)=>{
    const { username, email, password } = req.body;

    let user = await userModel.findOne({email});

    if(user){
        res.write("<h1>User already exist under this email!</h1>");
        res.write("<a href='/login'>Login</a>");
        res.end();
        return;
    }

    // const hashPassword = await bcrypt.hash(password,10);

    const newUser = new userModel({
        username,
        email,
        password
    });

    await newUser.save();

    res.redirect("/login");

};



const dashboard_get = (req,res)=>{
    res.render("dashboard");
};


const logout_post = (req,res) =>{
    req.session.destroy((err) =>{
        if(err) throw err;
        res.redirect("/");
    });
};


module.exports = { landing_page , login_get , login_post , register_get , register_post , dashboard_get , logout_post};