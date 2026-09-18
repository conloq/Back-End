import RecipeUser from "../services/recipeService.js";

const showRecipe = async (req, res) => {
    try {
        const userId = req.userId;

        const recipe = await RecipeUser.showRecipes(userId);
    return res.status(200).json({recipe});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

const createRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const nameRecipe = req.body.nameRecipe;
        
        if(!nameRecipe) return res.status(400).json({message:"Name missing"});

        await RecipeUser.createRecipe(nameRecipe, userId);

        res.status(201).json({message:"Recipe created successfully"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId) return res.status(400).json({message:"Id Recipe missing"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({message:"Recipe not found"});

        console.log(recipe);

        if(recipe.user_id != userId) return res.status(403).json({message:"action not allowed"});

        await RecipeUser.deleteRecipe(recipeId, userId);

        return res.status(200).json({message:"Recipe deleted"});
    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTING") return res.status(404).json({message:"ID does not exist"});
        res.status(500).json({error:"Internal server error"});
    }
}

const updateRecipe = async (req, res) => {
    try {
        const {nameRecipe} = req.body;
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId || !nameRecipe) return res.status(400).json({message:"Id or name Recipe missing"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({message:"Recipe not found"});

        if(recipe.user_id != userId) return res.status(403).json({message:"action not allowed"});

        await RecipeUser.updateUser(recipeId, nameRecipe);
        return res.status(200).json({message: "Recipe updated successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export {showRecipe, createRecipe, deleteRecipe, updateRecipe};