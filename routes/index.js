var express         = require("express");
var router          = express.Router();
var Dish            = require("../models/dish");
var passport        = require("passport");
var User            = require("../models/user");

//Root route
router.get("/", function(req, res) {
    res.render("landing");
});

//Show register from
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

//Handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({
            username: req.body.username, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar,
            bio: req.body.bio
        });

    if(req.body.adminCode === "dillydally"){
        newUser.isAdmin = true;
    }
    
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to ShibaEats, " + user.username + "!");
            res.redirect("/dishes");
        });
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

//Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/dishes",
        failureRedirect: "/login"
    }), function(req, res){});

//Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;