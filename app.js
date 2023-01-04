const express = require('express')
const bodyparser = require('body-parser')
const HttpError = require('./models/http-error')
const mongoose = require('mongoose')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/user-routes')

const app = express();

app.use(bodyparser.json())

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404)
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || "An unknown error occured" });
})

mongoose.connect('mongodb+srv://anubhav823:Anub2024@cluster0.kquelm4.mongodb.net/places?retryWrites=true&w=majority')
    .then(() => {
        console.log("Connected");
        app.listen(5000)
    })
    .catch(err => {
        console.error(err);
    }); 