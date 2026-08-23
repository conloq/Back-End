import User from "../models/userModel.js";

class UserService{
    async createUser(name, email, password) {
        const emailexists = await User.findOne({
            where: {email: email}
        });

        if(emailexists) throw new Error("EMAIL_EXISTS");
            
        await User.create({
            name: name,
            email: email,
            password: password
        });
    }

    async showUser(id) {
        const newUser = await User.findByPk(id, {
            attributes: {exclude: ['password']}
        });

        if(!newUser) throw new Error("ID_NOT_EXISTS");

        return newUser;
    }

    async deleteUser(id) {
        const destroy = await User.destroy({
            where: {id:id}
        });

        if(destroy === 0) throw new Error("ID_NOT_EXISTS");
    }
}


export default new UserService;