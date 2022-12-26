const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

const { v4: uuidv4 } = require('uuid')
let dummy_places = [
    {
        id: 'p1',
        title: 'Empire State',
        location: {
            lat: 123,
            lng: 112
        },
        address: 'adfa',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'No State',
        location: {
            lat: 456,
            lng: 1123
        },
        address: 'adfa',
        creator: 'u2'
    }
]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = dummy_places.find(p => {
        return p.id === placeId;
    })
    if (!place) {
        throw new HttpError('Could not find a place for the provided id', 404);
    }
    res.json({
        place
    });
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = dummy_places.filter(p => {
        return p.creator === userId;
    })
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({
        places
    });
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed', 422)
    }
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }
    dummy_places.push(createdPlace);
    console.log("added")
    res.status(201).json(createdPlace);
}

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed', 422)
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;
    const updatedPlace = { ...dummy_places.find(p => p.id === placeId) };
    const placeIndex = dummy_places.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    dummy_places[placeIndex] = updatedPlace;
    res.status(200).json({ place: updatedPlace })


}

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    if (!dummy_places.find(p => p.id === placeId)) {
        throw new HttpError("No such place found ", 404)
    }
    dummy_places = dummy_places.filter(p => p.id !== placeId)
    res.status(200).json({ message: "Deleted place with id " + placeId + " successfully" })
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;