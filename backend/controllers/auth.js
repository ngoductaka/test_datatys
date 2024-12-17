const jwt = require('jsonwebtoken');

const {
    authenticateUser,
    createUser,
} = require('../services/user');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email invalid' });
        }
        const user = await authenticateUser(email, password);
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ user, token })
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email invalid' });
        }
        const result = await createUser(email, password)
        res.json(result)
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}


module.exports = {
    login,
    signup
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isValidEmail = (email) => emailRegex.test(email);
