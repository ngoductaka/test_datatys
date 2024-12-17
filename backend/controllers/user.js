const {
    getList,
    getUserById,
    updateUser,
    // getUserProfilePicture
} = require('../services/user');

const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);

        return res.send(user);
    } catch (err) {
        return res.status(400).json({ message: 'Not Found' });
    }
}

const list = async (req, res) => {
    try {
        const users = await getList();
        return res.send(users);
    } catch (err) {
        return res.status(400).json({ message: 'Not Found' });
    }
}

const update = async (req, res) => {
    try {
        const { body } = req;
        const user = await getUserById(req.user._id);
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }
        const { email, ...restBody } = body;
        if (email && !isValidEmail(email)) {
            return res.status(401).json({
                message: 'Invalid Email'
            });
        }
        const updateData = Object.keys(restBody).reduce((cal, curr) => {
            if (body[curr]) {
                return {
                    ...cal,
                    [curr]: body[curr]
                }
            }
        }, {});
        updateData['id'] = user.id;

        const updated = await updateUser(updateData);
        if (updated < 1) {
            return res.json({ message: 'Update failed', code: 4000 });
        }
        return res.json({ message: 'Update user success', code: 2000 });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err });
    }
}

module.exports = {
    list,
    getProfile,
    update
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isValidEmail = (email) => emailRegex.test(email);
