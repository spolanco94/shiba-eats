var express         = require("express");
var router          = express.Router({mergeParams: true});
var Dish            = require("../models/dish");
var Comment         = require("../models/comment");
var middleware      = require("../middleware/");

//Comments - New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Dish.findById(req.params.id, function(err, dish){
        if(err){
            req.flash("error", "Something has gone wrong, please try again!");
        } else {
            res.render("comments/new", {dish : dish});
        }
    });
});

//Comments - Create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup dish using ID
    Dish.findById(req.params.id, function(err, dish){
        if(err){
            req.flash("error", "Dish cannot be found, it may have been removed by the owner. Please verify and try again!");
            res.redirect("/dishes");
        } else {
            //create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                } else {
                    //add username + id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    //connect new comment to dish
                    comment.save();
                    dish.comments.push(comment._id);
                    dish.save();
                    //redirect dish show page
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/dishes/" + dish._id);
                }
            });
            
        }
    });
});

//Comment edit route
router.get("/:comment_id/edit", middleware.commentOwnership, function(req, res){
    Dish.findById(req.params.id, function(err, foundDish){
        if(err || !foundDish){
            req.flash("error", "Dish cannot be found! Please verify and try again!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong retrieving the comment, please try again!");
                res.redirect("back");
            } else{
                res.render("comments/edit", {dish_id : req.params.id, comment: foundComment});
            }
        });
    });
});

//Comment update route
router.put("/:comment_id", middleware.commentOwnership, function(req, res){
    // res.send("Comment update route");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
            req.flash("error", "Whoops! Something went wrong while updating your comment. Please verify and try again!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/dishes/" + req.params.id);
        }
    });
});

//Comment destroy route
router.delete("/:comment_id", middleware.commentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong, please try again!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/dishes/" + req.params.id);
        }
    });
});

module.exports = router;