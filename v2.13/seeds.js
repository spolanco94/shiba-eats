var mongoose    = require("mongoose"),
    Dish        = require("./models/dish"),
    Comment     = require("./models/comment");

var data = [
    {
        name: "Hubert's Cove",
        image: "https://farm4.staticflickr.com/3544/3871329595_bb78425938.jpg",
        description: "Doggo ipsum very jealous pupper such treat super chub ur givin me a spook, adorable doggo what a nice floof heckin good boys and girls, doing me a frighten mlem. snoot. Wow very biscit long doggo pupper shibe thicc, noodle horse borkdrive long doggo. H*ck smol h*ck long doggo, ruff heckin good boys and girls. much ruin diet borkf. Length boy puggorino boofers wow very biscit, fat boi bork. Blep the neighborhood pupper you are doing me the shock puggo long doggo, much ruin diet blop ur givin me a spook. Long woofer lotsa pats big ol pupper boofers borkf blep, lotsa pats I am bekom fat porgo doing me a frighten."
    },
    {
        name: "Shibe Gathering",
        image: "https://farm4.staticflickr.com/3149/3062180144_ee0d2d466a.jpg",
        description: "Doggo ipsum very jealous pupper such treat super chub ur givin me a spook, adorable doggo what a nice floof heckin good boys and girls, doing me a frighten mlem. snoot. Wow very biscit long doggo pupper shibe thicc, noodle horse borkdrive long doggo. H*ck smol h*ck long doggo, ruff heckin good boys and girls. much ruin diet borkf. Length boy puggorino boofers wow very biscit, fat boi bork. Blep the neighborhood pupper you are doing me the shock puggo long doggo, much ruin diet blop ur givin me a spook. Long woofer lotsa pats big ol pupper boofers borkf blep, lotsa pats I am bekom fat porgo doing me a frighten."
    },
    {
        name: "Doggo Manor",
        image: "https://farm1.staticflickr.com/55/113639275_a7466643a0.jpg",
        description: "Doggo ipsum very jealous pupper such treat super chub ur givin me a spook, adorable doggo what a nice floof heckin good boys and girls, doing me a frighten mlem. snoot. Wow very biscit long doggo pupper shibe thicc, noodle horse borkdrive long doggo. H*ck smol h*ck long doggo, ruff heckin good boys and girls. much ruin diet borkf. Length boy puggorino boofers wow very biscit, fat boi bork. Blep the neighborhood pupper you are doing me the shock puggo long doggo, much ruin diet blop ur givin me a spook. Long woofer lotsa pats big ol pupper boofers borkf blep, lotsa pats I am bekom fat porgo doing me a frighten."
    }
]

function seedDB(){
    // REMOVE ALL DISHES  
    Dish.remove({}, function(err){
        // if(err){
        //     console.log(err);
        // } 
        // console.log("Removed dishes!");
        // // CREATE DISHES
        // data.forEach(function(seed){
        //     Dish.create(seed, function(err, dish){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             console.log("Created dish!");
        //             // GENERATE COMMENTS
        //             Comment.create(
        //                 {
        //                     text: "Whoa this was so scary! He really tried to bite me!",
        //                     author: "Susan"
        //                 }, function(err, comment){
        //                     if(err){
        //                         console.log(err);
        //                     } else {
        //                         dish.comments.push(comment);
        //                         dish.save();
        //                         console.log("Created new comment!");
        //                     }
        //                 });
        //         }
        //     });
        // });
    });
    
    
}

module.exports = seedDB;