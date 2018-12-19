var express = require("express");
var router = express.Router();
var Commodity = require("../models/commodity");

// Show index
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

// Click "Create" commodity
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
	};
	Commodity.create(newCommodity, function(err, newCreated){
		if(err){
			console.log(err);
		}
		else{
			req.redirect("/commodity");
		}
	});
});

// New - Create page
router.get("/new", function(req, res){
	res.render("commodity/new");
});

// Show specific commodity
router.get("/:id", function(req, res){
	Commodity.findById({}, function(err, foundCommodity){
		if(err){
			console.log(err);
		}
		else{
			res.render("commodity/show", {commodity: foundCommodity});
		}
	});
});

// Edit - Update page
router.get("/:id/edit", function(req, res){
	Commodity.findById(req.params.id, function(err, foundCommodity){
		res.render("commodity/edit", {commodity: foundCommodity});
	});
});

// Update specific commodity
router.put("/:id", function(req, res){
	Commodity.findByIdAndUpdate(req.params.id, req.body.commodity, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/commodity/" + req.params.id);
		}
	});
});

// Delete specific commodity
router.delete("/:id", function(req, res){
	Commodity.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/commodity");
		}
	});
});

module.exports = router;