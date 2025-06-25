const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

async function adminChecker(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        req.isAdmin = false;
        next();
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const { id } = decoded;
    const user = await userModel.findById(id);
    if (!user) {
        throw Error("user doesn't exist");
    }
    if (user.uid.toLowerCase() == '23bcs14148') {
        req.isAdmin = true;
    }
    else {
        req.isAdmin = false;
    }

    next();
}

module.exports = adminChecker;