var express         = require("express"),
    Dish            = require("../models/dish"),
    Comment         = require("../models/comment"),
    passport        = require("passport"),
    User            = require("../models/user");
    
var router = express.Router();

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
    var newUser = new User({username: req.body.username});
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