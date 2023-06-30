const express = require("express");
const session = require("express-session"); // A middleware for managing user sessions in an Express.js application. When a user visits a web application, a session is created to store information about the user's activity and data that needs to be persisted across requests.
const MongoDBSession = require("connect-mongodb-session")(session); //This package store our session in MongoDB.
const mongoose = require("mongoose");
const app = express();

const mongoURI = 'mongodb://127.0.0.1:27017/sessions';
mongoose.connect(mongoURI);


// Below one is for storing session in my "sessions" database in "mySessions" collection.
const store  = new MongoDBSession({
    uri: mongoURI,
    collection: "mySessions",
});


app.use(session({
    secret:"Key that will sign cookie", // The secret option is a key used to sign the session cookie, ensuring that the cookie data cannot be tampered with.
    resave:false, // The resave option determines whether the session should be saved to the store on every request, even if the session data has not changed.
    saveUninitialized: false, // The saveUninitialized option controls whether or not a session should be created for a user who has not yet been identified (i.e., has not yet logged in or provided any other identifying information).
    // "true", a session will be created for every user who visits the application. Useful for tracking user behavior, even if the user has not yet logged in.
    // "false", a session will only be created for a user once they have been identified(login).
    
    store: store,

    //By setting both resave and saveUninitialized to false, the middleware will only save the session once to the store if user logged in.
}));



app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));



const sessionRoutes = require("./routes/sessionRoutes");
app.use("/", sessionRoutes);



app.listen(3000,()=>{
    console.log("Server running at port 3000");
});