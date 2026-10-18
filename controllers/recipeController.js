import RecipeUser from "../services/recipeService.js";

const showRecipe = async (req, res) => {
    try {
        const userId = req.userId;

        const recipe = await RecipeUser.showRecipes(userId);
        return res.status(200).json({recipe});
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const showOneRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId) return res.status(400).json({error:"Id da receita não pode estar vazio"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({error:"Receita não encontrada"});

        console.log(recipe);

        if(recipe.userId != userId) return res.status(404).json({error:"Ação não permitida"});

        return res.status(200).json({recipes: recipe});
    } catch (error) {
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const createRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const nameRecipe = req.body.name;
        
        if(!nameRecipe) return res.status(400).json({error:"Nome não pode estar vazio"});
        
        const existsRecipe = await RecipeUser.showRecipeByName(nameRecipe, userId);
        console.log(existsRecipe)

        if(existsRecipe) return res.status(409).json({error: "Receita já existe"});
        
        const recipe = await RecipeUser.createRecipe(nameRecipe, userId);

        res.status(201).json({message:"Receita criada com sucesso", recipe});
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId) return res.status(400).json({error:"Id da receita não pode estar vazio"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({error:"Receita não encontrada"});

        console.log(recipe);

        if(recipe.userId != userId) return res.status(404).json({error:"Ação não permitida"});

        await RecipeUser.deleteRecipe(recipeId);

        return res.sendStatus(204);
    } catch (error) {
        if(error.message === "ID_NOT_EXISTING") return res.status(404).json({error:"Id não existe"});
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const updateRecipe = async (req, res) => {
    try {
        const nameRecipe = req.body.name;
        const userId = req.userId;
        const recipeId = req.params.recipeId;

        if(!recipeId || !nameRecipe) return res.status(400).json({error:"Id ou nome da receita não podem estar vazios"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(400).json({error:"Receita não encontrada"});

        if(recipe.userId != userId) return res.status(404).json({error:"Ação não permitida"});

        await RecipeUser.updateUser(recipeId, nameRecipe);
        return res.status(200).json({message: "Receita atualizada com sucesso"});
    } catch (error) {
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

export {showRecipe, createRecipe, deleteRecipe, updateRecipe, showOneRecipe};