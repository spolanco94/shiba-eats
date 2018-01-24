var express         = require("express");
var Dish            = require("../models/dish");
var router          = express.Router();
var middleware      = require("../middleware/");
var geocoder        = require('geocoder');

//Index - Show all Dishes
router.get("/", function(req, res) {
    //Get all dishes from db
    Dish.find({}, function(err, allDishes) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("dishes/index", { dishes: allDishes, currentUser: req.user, page: "dishes" });
        }
    }); 

});

//Create - Add new Dishes to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    //Grab data from form to push to dishes array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    
    var newDish = { name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng, price: price };
    //Create a new dish and save to DB
        Dish.create(newDish, function(err, newlyCreated) {
            if (err) {
                console.log(err);
            }
            else {
                //redirect back to dishes page
                res.redirect("/dishes");
            }
        });
    });
});

//NEW - Display form to create a new Dish
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("dishes/new");
});

// SHOW - shows more info about one dish
router.get("/:id", function(req, res) {
    //find dish with provided ID
    Dish.findById(req.params.id).populate("comments").exec(function(err, foundDish) {
        if (err || !foundDish) {
            req.flash("error", "Dish cannot be found!");
            res.redirect("back");
        }
        else {
            console.log(foundDish);
            //render show template 
            res.render("dishes/show", { dish: foundDish });
        }
    });
});

//Edit Dish Route
router.get("/:id/edit", middleware.dishOwnership, function(req, res){
    Dish.findById(req.params.id, function(err, foundDish){
        if(err){
            req.flash("error", "Dish not found!");
            req.redirect("back");
        }
         res.render("dishes/edit", { dish: foundDish });
    });
});

//Update Dish Route
router.put("/:id", middleware.dishOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = { name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng };
    //find and update the correct dish
        Dish.findByIdAndUpdate(req.params.id, req.body.dish, function(err, updatedDish){
            if(err){
                res.redirect("dishes");
            } else {
                //redirect somewhere
                res.redirect("/dishes/" + req.params.id);
            }
        });
    });
});

//Delete Dish Route
router.delete("/:id", middleware.dishOwnership, function(req, res){
    Dish.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/dishes");
        } else {
            res.redirect("/dishes");
        }
    });
});

module.exports = router;