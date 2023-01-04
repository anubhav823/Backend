const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

const Place = require('../models/place')

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);

    } catch (err) {
        const error = new HttpError("Error!", 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find a place for the provided id', 404);
        return next(error);
    }
    res.json({
        place: place.toObject({ getters: true })
    });
}

const getPlacesByUserId = async (req, res, next) => {
    const creatorId = req.params.uid;
    let places;
    console.log(creatorId)
    try {
        places = await Place.find({ creator: creatorId });
    } catch (err) {
        console.log(err)
        const error = new HttpError("Error!", 500);
        return next(error);
    }

    if (!places) {
        const error = new HttpError('Could not find a place for the provided id', 404);
        return next(error);
    }
    res.json({
        places: places.map(place => place.toObject({ getters: true }))
    });
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed', 422)
    }
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = new Place({
        title,
        description,
        location: coordinates,
        image: 'new image',
        address,
        creator
    })
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError('Failed, please try again', 500);
        return next(error)
    }
    res.status(201).json({ place: createdPlace })
}

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed', 422)
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something wrong', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;
    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something wrong', 500);
        return next(error);
    }
    res.status(200).json({ place: place.toObject({ getters: true }) })


}

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something wrong', 500);
        return next(error);
    }
    try {
        await place.remove();
    } catch (err) {
        const error = new HttpError('Something wrong', 500);
        return next(error); 
    }
    res.status(200).json({ message: "Deleted place with id " + placeId + " successfully" })
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;