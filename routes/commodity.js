var express = require("express");
var router = express.Router();
var Commodity = require("../models/commodity");

router.get("/", function(req, res){
	Commodity.find({}, function(err, foundCommodity){
		if(err){
			console.log(err);
		}
		else{
			res.render("/commodity/index", {
				commodity: foundCommodity, 
				currentUser: req.user
			});
		}
	});
});

router.post("/", function(req, res){
	var newCommodity = {
		name: req.body.name,
		type: req.body.type,
		image: req.body.image,
		specification: req.body.spcification,
		description: req.body.description,
		descriptionDetailed: req.body.descriptionDetailed,
		quantity: req.body.quantity,
		price: req.body.price,
		discount: req.body.discount,
		discountDeadline: req.body.discountDeadline,
		seller: {
			id: req.user._id,
			username: req.user.username
		}
	}
	Commodity.create(req.body, function(err, newCreated){
		if(err){
			console.log(err);
		}
		else{
			req.render("/commodity");
		}
	})
});

router.get("/:id", function(req, res){

});