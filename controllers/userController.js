import { createHash } from "../services/argon2.js";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
    const {name, email} = req.body;
    const password = await createHash(req.body.password);

    try {
        await User.create({
            name: name,
            email: email,
            password: password
        });
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
}