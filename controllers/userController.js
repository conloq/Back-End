import userService from "../services/userService.js";
import { createHash } from "../services/argon2.js";

const createUser = async (req, res) => {
    try {
        const {name, email} = req.body;
        const password = await createHash(req.body.password);

        await userService.createUser(name, email, password);

        res.status(201).json({message: "Usuário criado com sucesso!"});
    } catch (error) {
        console.error(error.message);

        if(error.message === 'EMAIL_EXISTS') {
            return res.status(409).json({error: "E-mail já existente"});
        }

        res.status(500).json({error: "Erro interno no servidor"});
    }
}

const showUser = async (req, res) => {
    try {
        const id = req.params.id;

        if(!id) return res.status(400).json({message:"ID não informado"});
        if(isNaN(id)) return res.status(400).json({message:"Id deve conter apenas números"});
        
        const user = await userService.showUser(id);
        res.status(200).json({user: user});

    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTS") {
            return res.status(404).json({error: "ID não existe"});
        }
        res.status(500).json({error:"Erro interno no servidor"});
    }
}

const deleteUser = async (req,res) => {
    try {
        const id = req.params.id;

        if(!id) return res.status(400).json({message:"ID não informado"});
        if(isNaN(id)) return res.status(400).json({message:"Id deve conter apenas números"});

        await userService.deleteUser(id);
        res.status(200).json({message: "Usuário deletado"});
    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTS"){
            return res.status(404).json({error: "ID não existe"});
        }
        res.status(500).json({error:"Erro interno no servidor"});  
    }
}

export {createUser, showUser, deleteUser};