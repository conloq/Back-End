import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";
import Temperature from "../models/temperatureModel.js";

User.hasMany(Recipe, {
    foreignKey: "userId"
});

Recipe.belongsTo(User, {
    foreignKey: "userId"
});

Recipe.hasMany(Temperature, {
    foreignKey: "recipeId"
});

Temperature.belongsTo(Recipe, {
    foreignKey: "recipeId"
});