import AuthService from "../services/authService.js";

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(200).json({message: "Email and password are required"});
        }

        const data = await AuthService.login(email, password);
        return res.status(200).json(data);
    } catch (error) {
        if(error.message === "INVALID_CREDENTIAL") {
            return res.status(401).json({error: "Invalid email or password"});
        }
        res.status(500).json({error: "Internal server error"});
    }
}

export default login;