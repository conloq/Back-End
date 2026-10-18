import Temperature from "../models/temperatureModel.js";


class TemperatureRecipe {
    async createTemperature(
        maxTemperatureRamp, 
        minTemperatureRamp, 
        maxTemperatureLimit, 
        minTemperatureLimit, 
        timer, 
        initialization, 
        idealTime, 
        activeTemperature,
        recipeId){
            const temperatue = Temperature.create({
                maxTemperatureRamp, 
                minTemperatureRamp, 
                maxTemperatureLimit,
                minTemperatureLimit,
                timer,
                initialization,
                idealTime,
                activeTemperature,
                recipeId});
            return temperatue;
    }

    async showTemperature(recipe_id){
        const temperatures = await Temperature.findAll({where:{
            recipeId: recipe_id
        }})

        return temperatures;
    }
}

export default new TemperatureRecipe;