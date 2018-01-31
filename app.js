var express         = require("express"),
    app             = express(),
    dotenv          = require('dotenv').config(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    Dish            = require("./models/dish"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");

//Requiring routes
var commentRoutes       = require("./routes/comments"),
    dishRoutes          = require("./routes/dishes"),
    indexRoutes         = require("./routes/index"),
    passwordRoutes      = require("./routes/password"),
    userRoutes          = require("./routes/user");

//seedDB(); //seed the DB
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://steve:hewie@ds119688.mlab.com:19688/shibaeats");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
app.set("view engine", "ejs");

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Hewie loves cheese and lambchop!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/dishes", dishRoutes);
app.use("/dishes/:id/comments", commentRoutes);
app.use("/", passwordRoutes);
app.use("/users/:id", userRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("ShibaEats Server Started");
});