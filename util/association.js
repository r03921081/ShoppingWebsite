const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const UserComment = require("../models/userComment");

// User     1:n     Product
exports.UserHasManyProduct = User.hasMany(Product);
// Product  n:1     User
exports.ProductBelongsToUser = Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});

// User     1:1     Cart
exports.UserHasOneCart = User.hasOne(Cart);
// Cart     1:1     User
exports.CartBelongsToUser = Cart.belongsTo(User);

// Cart     n:m     Product     {CartItem}
exports.CartBelongsToManyProduct = Cart.belongsToMany(Product, {through: CartItem});
// Product  n:m     Cart        {CartItem}
exports.ProductBelongsToManyCart = Product.belongsToMany(Cart, {through: CartItem});

// User     1:n     Order
exports.UserHasManyOrder = User.hasMany(Order);
// Order    n:1     User
exports.OrderBelongsToUser = Order.belongsTo(User);
// Order    n:m     Product     {OrderItem}
exports.OrderBelongsToManyProduct = Order.belongsToMany(Product, {through: OrderItem});

// User     1:n     Comment
exports.UserHasManyComment = User.hasMany(UserComment);
// Comment  n:1     User
exports.CommentBelongsToUser = UserComment.belongsTo(User);

// Product  1:n     Comment     
exports.ProductHasManyComment = Product.hasMany(UserComment);
// Comment  n:1     Product     
exports.CommentBelongsToProduct = UserComment.belongsTo(Product);