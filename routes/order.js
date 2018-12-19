var express = require("express");
var router = express.Router();
var Order = require("../models/order");
var Commodity = require("../models/commodity");

// Show index
router.get("/", function(req, res){
	Order.find({}, function(err, foundOrder){
		if(err){
			console.log(err);
		}
		else{
			res.render("/order/index", {
				order: foundOrder, 
				currentUser: req.user
			});
		}
	});
});

// Click "Create" commodity
router.post("/", function(req, res){
	Commodity.findById(req.params.id, function(err, foundCommodity){
		if(err){
			console.log(err);
		}
		else{
			Order.create(req.body.order, function(err, newOrder){
				if(err){
					console.log(err);
				}
				else{
					newOrder.buyer = req.user._id;
					newOrder.username = req.user.username;
					newOrder.save();
					foundCommodity.quantity -= req.body.order.quantity;
					foundCommodity.save();
					res.redirect("/commodity");
				}
			});
		}
	});
});

// New - Create page
router.get("/new", function(req, res){
	res.render("order/new");
});

// Show specific order
router.get("/:id", function(req, res){
	Commodity.findById({}, function(err, foundOrder){
		if(err){
			console.log(err);
		}
		else{
			res.render("order/show", {order: foundOrder});
		}
	});
});

// Edit - Update page
router.get("/:id/edit", function(req, res){
	Order.findById(req.params.id, function(err, foundOrder){
		res.render("order/edit", {order: foundOrder});
	});
});

// Update specific order
router.put("/:id", function(req, res){
	Order.findByIdAndUpdate(req.params.id, req.body.order, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/order/" + req.params.id);
		}
	});
});

// Delete specific order
router.delete("/:id", function(req, res){
	Order.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/order");
		}
	});
});

module.exports = router;