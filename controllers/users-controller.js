const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

let dummy_users = [
    {
        id: 'u1',
        name: 'Anubhav Jain',
        email: 'anubhav@gmail.com',
        password: 'anubhav'
    }
]
const getUsers = (req, res, next) => {
    res.status(200).json({ users: dummy_users })
}
const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed', 422)
    }
    const { name, email, password } = req.body;
    let userIsPresent = dummy_users.find(u => u.email === email)
    if (userIsPresent) {
        throw new HttpError("User is already registered, Please try logging in or enter a different email id", 403)
    }
    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    }
    dummy_users.push(createdUser)
    console.log('user created')
    res.status(201).json({ message: "User added" })
}
const login = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = dummy_users.find(user => user.email === email)
    if (!identifiedUser) {
        throw new HttpError('No such user found', 401);
    }
    if (identifiedUser.password === password) {
        res.status(200).json({ message: 'Logged in successfully' })
    } else {
        throw new HttpError('Password incorrect', 401)
    }
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login