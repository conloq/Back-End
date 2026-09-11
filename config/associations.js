import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";

User.hasMany(Recipe, {
    foreignKey: "user_id"
})

Recipe.belongsTo(User, {
    foreignKey: "user_id"
})
