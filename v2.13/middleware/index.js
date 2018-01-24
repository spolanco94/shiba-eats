var Dish = require("../models/dish");
var Comment = require("../models/comment");

//all middleware goes here
var middlewareObj = {};

middlewareObj.dishOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Dish.findById(req.params.id, function(err, foundDish){
            if(err || !foundDish){
                req.flash("error", "Dish cannot be found!");
                res.redirect("back");
            } else {
                //does user own dish, if so let them edit/delete
                if(foundDish.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.commentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                //does user own comment, if so let them edit/delete
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;