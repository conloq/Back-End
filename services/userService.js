import User from "../models/userModel.js";

class UserService{
    async createUser(name, email, password) {
        const emailexists = await User.findOne({
            where: {email}
        });

        if(emailexists) throw new Error("EMAIL_EXISTS");
            
        await User.create({name, email, password});
    }

    async showUser(id) {
        const newUser = await User.findByPk(id, {
            attributes: {exclude: ["password"]} 
        });

        if(!newUser) throw new Error("ID_NOT_EXISTS");

        return newUser;
    }

    async deleteUser(id) {
        const destroy = await User.destroy({
            where: {id}
        });

        if(destroy === 0) throw new Error("ID_NOT_EXISTS");
    }

    async updateUser(id, name, email, fone = "", password) {
        if(!password) {
            const update = await User.update({name, email, fone}, {where:{id}});
            return update;
        }

        const update = await User.update({name, email, fone, password}, {where:{id}});
        return update;
    }

    async  updateImage(id, url) {
        const updadeImage = await User.update({url_image: url}, {where:{id}});

        if (updated === 0) throw new Error("ID_NOT_EXISTS");
        return updadeImage;
    }
}


export default new UserService;