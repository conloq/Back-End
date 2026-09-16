import Recipe from "../models/recipeModel.js";

class RecipeUser{
    async showRecipes(idUser) {
        const recipeList = await Recipe.findAll({
            where: {user_id: idUser}
        })

        if(!recipeList) throw new Error("ID_NOT_EXISTS");

        return recipeList;
    }

    async createRecipe(nameRecipe, idUser) {
        
    }

}

export default new RecipeUser;