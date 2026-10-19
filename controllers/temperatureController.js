// code-wiki: Valida o proprietário antes de acessar receitas ou rampas, sem revelar recursos alheios.
import TemperatureRecipe from "../services/temperatureService.js";
import RecipeUser from "../services/recipeService.js";

const createTemperature = async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.id;

        if(!recipeId) return res.status(400).json({error:"ID receita não informado!"});

        const recipe = await RecipeUser.showOneRecipe(recipeId);

        if(!recipe) return res.status(404).json({error:"Receita não encontrada"});

        if(userId != recipe.userId) return res.status(404).json({error:"Receita não encontrada"});

        const {
            maxTemperatureRamp, 
            minTemperatureRamp, 
            maxTemperatureLimit,
            minTemperatureLimit,
            timer,
            initialization,
            idealTime,
            activeTemperature,
            } = req.body;

        const temperature = await TemperatureRecipe.createTemperature(
            maxTemperatureRamp, 
            minTemperatureRamp, 
            maxTemperatureLimit,
            minTemperatureLimit,
            timer,
            initialization,
            idealTime,
            activeTemperature,
            recipeId);

        res.status(201).json({message:"Temperatura criado com sucesso", temperature});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:"Erro interno do servidor"});
    }
}

const showTemperature = async (req, res) => {
    const userId = req.userId;
    const recipeId = req.params.id;

    if(!recipeId) return res.status(400).json({error:"ID receita não informado!"});
            
    const recipe = await RecipeUser.showOneRecipe(recipeId);

    if(!recipe) return res.status(404).json({error:"Receita não encontrada"});

    if(userId != recipe.userId) return res.status(404).json({error:"Receita não encontrada"});

    const temperatures = await TemperatureRecipe.showTemperature(recipeId);

    return res.status(200).json({temperatures: temperatures});
}

export {createTemperature, showTemperature};