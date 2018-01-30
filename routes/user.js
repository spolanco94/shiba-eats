var express         = require("express");
var router          = express.Router({ mergeParams: true });
var Dish            = require("../models/dish");
var User            = require("../models/user");

//User Profile
router.get("/", function(req, res){
    User.findById(req.params.id, function(err, foundUser){ 
        if(err){
            req.flash("error", "User not found. Please try again.");
            return res.redirect("back");
        }
        Dish.find().where("author.id").equals(foundUser._id).exec(function(err, dishes){
            if(err){
                req.flash("error", "Something went wrong.");
                return res.redirect("back");
            }
            // eval(require("locus"));
            res.render("users/show", { user: foundUser, dishes: dishes });
        });
    });
});

//Edit profile route
router.get("/edit", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", "Error finding user, please try again.");
            res.redirect("back");
        } else {
            res.render("users/edit", { user: foundUser });
        }
    });
});

//Update user profile route
router.put("/", function(req, res){
    var newData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        bio: req.body.bio
    };
    User.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, user){
        if(err) {
            req.flash("error", "There was an error updating your profile. Please try again.");
            res.redirect("back");
        } else {
            req.flash("success", "Profile updated!");
            res.redirect("/users/" + user._id);
        }
    });
});

module.exports = router;