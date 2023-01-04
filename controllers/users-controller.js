const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const User = require('../models/user')

const getUsers = (req, res, next) => {
    res.status(200).json({ users: dummy_users })
}
const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed', 422))
    }
    const { name, email, password, places, address, image} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Error!", 500);
        return next(error);
    }
    if (existingUser) {
        // console.log(existingUser.toObject({getters:true}).email)
        const error = new HttpError("User exists already!", 422);
        return next(error);
    }
    const createdUser = new User({
        name,
        email,
        password,
        image,
        places,
        address
    })
    try {
        await createdUser.save();
    } catch (err) {
        console.log(err)
        const error = new HttpError("Error saving!", 500);
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}
const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Error!", 500);
        return next(error);
    }
    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Password incorrect', 401))
    } else {
        res.status(200).json({ message: 'Logged in successfully' })
    }
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login