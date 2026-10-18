import { where } from "sequelize";
import Recipe from "../models/recipeModel.js";

class RecipeUser{
    
    async createRecipe(nameRecipe, idUser) {
        const recipe = await Recipe.create({name: nameRecipe, userId: idUser});
        return recipe;
    }

    async showRecipes(idUser) {
        const recipeList = await Recipe.findAll({
            where: {userId: idUser}
        })
        return recipeList;
    }

    async showOneRecipe(recipeId) {
        const recipe = await Recipe.findByPk(recipeId);
        return recipe;
    }

    async showRecipeByName(nameRecipe, user_id) {
        const recipe = await Recipe.findOne({where:{
            name: nameRecipe, userId: user_id
        }})
        return recipe;
    }

    async deleteRecipe(recipeId) {
        const destroy = await Recipe.destroy({
            where:{id: recipeId}
        });

        if(destroy === 0) throw new Error("ID_NOT_EXISTING");
    }

    async updateUser(recipeId, nameRecipe) {
        const update = await Recipe.update({name: nameRecipe}, {where: {id: recipeId}})
    }
}

export default new RecipeUser;