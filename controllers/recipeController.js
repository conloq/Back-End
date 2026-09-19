import RecipeUser from "../services/recipeService.js";

const showRecipe = async (req, res) => {
    try {
        const userId = req.userId;

        const recipe = await RecipeUser.showRecipes(userId);
        return res.status(200).json({recipe});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const createRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const nameRecipe = req.body.nameRecipe;
        
        if(!nameRecipe) return res.status(400).json({message:"Nome não pode estar vazio"});

        await RecipeUser.createRecipe(nameRecipe, userId);

        res.status(201).json({message:"Receita criada com sucesso"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId) return res.status(400).json({message:"Id da receita não pode estar vazio"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({message:"Receita não encontrada"});

        console.log(recipe);

        if(recipe.user_id != userId) return res.status(403).json({message:"Ação não permitida"});

        await RecipeUser.deleteRecipe(recipeId, userId);

        return res.status(204);
    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTING") return res.status(404).json({message:"Id não existe"});
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const updateRecipe = async (req, res) => {
    try {
        const {nameRecipe} = req.body;
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId || !nameRecipe) return res.status(400).json({message:"Id ou nome da receita não podem estar vazios"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({message:"Receita não encontrada"});

        if(recipe.user_id != userId) return res.status(403).json({message:"Ação não permitida"});

        await RecipeUser.updateUser(recipeId, nameRecipe);
        return res.status(200).json({message: "Receita atualizada com sucesso"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

export {showRecipe, createRecipe, deleteRecipe, updateRecipe};