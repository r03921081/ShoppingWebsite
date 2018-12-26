const Product = require("../models/product");
const User = require("../models/user");
const Comment = require("../models/comment");

const association = {};
association.UserHasManyProduct = User.hasMany(Product, {foreignKey: "fk_userid", sourceKey: "id"});
association.ProductBelongsToUser = Product.belongsTo(User, {foreignKey: "fk_userid", targetKey: "id"});

association.UserHasManyComment = User.hasMany(Comment, {foreignKey: "fk_userid", sourceKey: "id"});
association.CommentBelongsToUser = Comment.belongsTo(User, {foreignKey: "fk_userid", targetKey: "id"});

association.ProductHasManyComment = Product.hasMany(Comment, {foreignKey: "fk_prodid", sourceKey: "pid"});
association.CommentBelongsToProduct = Comment.belongsTo(Product, {foreignKey: "fk_prodid", targetKey: "pid"});

module.exports = association;