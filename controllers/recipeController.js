import RecipeUser from "../services/recipeService.js";

const showRecipe = async (req, res) => {
    try {

        if(!id) return res.status(400).json({message:"ID not provided"});
        if(isNaN(id)) return res.status(400).json({message:"ID should contain only numbers"});

        const id = req.userId;
        const recipe = await RecipeUser.showRecipe(id);
    return res.status(200).json({recipe})
    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTS") {
            return res.status(404).json({error:"ID does not exist"});
        }
        res.status(500).json({error:"Internal server error"});
    }
}

const createRecipe = async (req, res) => {
    try {
        const id = req.userId;
        const name = req.body.nameRecipe;
        await RecipeUser.createRecipe(name, id);

        res.status(201).json({message:"Recipe created successfully"});
    } catch (error) {
        console.error(error.message);
    }
}

export {showRecipe};