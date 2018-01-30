var express         = require("express");
var Dish            = require("../models/dish");
var router          = express.Router();
var middleware      = require("../middleware/");
var geocoder        = require('geocoder');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'shibacodes', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//Index - Show all Dishes
router.get("/", function(req, res) {
    var noMatch = null;
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        //Filter out titles of each dish
        Dish.find({ name: regex }.skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allDishes) {
            Dish.count({ name : regex }).exec(function(err, count){
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                if(allDishes.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("dishes/index", { 
                    dishes: allDishes, 
                    currentUser: req.user, 
                    page: "dishes", 
                    noMatch: noMatch, 
                    search: req.query.search,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
                }
                
            });
        })); 
    } else {
        //Get all dishes from db
        Dish.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allDishes) {
            Dish.count().exec(function(err, count){
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("dishes/index", { 
                        dishes: allDishes, 
                        currentUser: req.user, 
                        page: "dishes", 
                        noMatch: noMatch, 
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: false
                    });
                }
                
            })
        }); 
        
    }

});

//Create - Add new Dishes to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
      req.body.dish.image = result.secure_url;
      // add author to campground
      req.body.dish.author = {
        id: req.user._id,
        username: req.user.username
      };
      Dish.create(req.body.dish, function(err, dish) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/dishes/' + dish.id);
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
    geocoder.geocode(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
      req.body.dish.image = result.secure_url;
      // add author to campground
      req.body.dish.author = {
        id: req.user._id,
        username: req.user.username
      };
      Dish.create(req.body.dish, function(err, dish) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/dishes/' + dish.id);
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;