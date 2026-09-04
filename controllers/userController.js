import userService from "../services/userService.js";
import { createHash } from "../services/argon2.js";
import cloudinary from "../config/cloudinary.js";

const createUser = async (req, res) => {
    try {
        const {name, email} = req.body;
        const password = await createHash(req.body.password);

        await userService.createUser(name, email, password);

        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        console.error(error.message);

        if(error.message === 'EMAIL_EXISTS') {
            return res.status(409).json({error:"Existing email"});
        }

        res.status(500).json({error:"Internal server error"});
    }
}

const showUser = async (req, res) => {
    try {
        const id = req.userId;

        if(!id) return res.status(400).json({message:"ID not provided"});
        if(isNaN(id)) return res.status(400).json({message:"ID should contain only numbers"});
        
        const user = await userService.showUser(id);
        res.status(200).json({user: user});

    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTS") {
            return res.status(404).json({error:"ID does not exist"});
        }
        res.status(500).json({error:"Internal server error"});
    }
}

const deleteUser = async (req,res) => {
    try {
        const id = req.userId;

        if(!id) return res.status(400).json({message:"ID not provided"});
        if(isNaN(id)) return res.status(400).json({message:"ID should contain only numbers"});

        await userService.deleteUser(id);
        res.status(200).json({message:"User deleted"});
    } catch (error) {
        console.error(error.message);
        if(error.message === "ID_NOT_EXISTS"){
            return res.status(404).json({error:"ID does not exist"});
        }
        res.status(500).json({error:"Internal server error"});  
    }
}

const updateUser = async (req,res) => {
    try {
        const {name, email, fone, password} = req.body;
        const id = req.userId;

        if(!id) return res.status(400).json({message:"ID not provided"});
        if(isNaN(id)) return res.status(400).json({message:"ID should contain only numbers"});

        if(!password){
            await userService.updateUser(id, name, email, fone);
            return res.status(200).json({message: "User updated successfully"});
        }
    
        const hashPassword = await createHash(password);
        await userService.updateUser(id, name, email, fone, hashPassword);
        return res.status(200).json({message: "User updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"});
    }

}

const updateImage = async (req, res) => {
    try {
        const id = req.userId;
        const imageUser = req.file;
        
        if(!id) return res.status(400).json({message:"ID not provided"});
        if(isNaN(id)) return res.status(400).json({message:"ID should contain only numbers"});

        if(!imageUser) return res.status(400).json({message:"Image not provided"});

        const resultCloudinary = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "Users Mash"
                },
                (error, result) => {
                    if(error) return reject(error);
                    resolve(result)
                }
            );
            stream.end(imageUser.buffer);
        });

        await userService.updateImage(id, resultCloudinary.secure_url);

        return res.status(200).json({message: "Imagem enviada com sucesso!", url: resultCloudinary.secure_url});
        
    } catch (error) {
        console.error(error);
        if (error.message === "ID_NOT_EXISTS") {
            return res.status(404).json({error: "ID does not exist"});
        }
        res.status(500).json({error:"Internal server error"});
    }
}

export {createUser, showUser, deleteUser, updateUser, updateImage};