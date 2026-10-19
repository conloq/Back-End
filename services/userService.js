// code-wiki: Persiste perfis e impede o uso de e-mail pertencente a outra conta.
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
        await User.destroy({
            where: {id}
        });
    }

    async updateUser(id, name, email, phone, password) {
        const emailexists = await User.findOne({
            where: {email}
        });

        if(emailexists && emailexists.id != id) throw new Error("EMAIL_EXISTS");

        if(!password) {
            const update = await User.update({name, email, phone}, {where:{id}});
            return update;
        }

        const update = await User.update({name, email, phone, password}, {where:{id}});
        return update;
    }

    async  updateImage(id, url) {
        const updateImage = await User.update({urlImage: url}, {where:{id}});
        return updateImage;
    }
}


export default new UserService;