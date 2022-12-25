const HttpError = require('../models/http-error')
const {v4 : uuidv4} = require('uuid')
const dummy_places = [
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

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = dummy_places.find(p => {
        return p.creator === userId;
    })
    if (!place) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({
        place
    });
}

const createPlace = (req, res, next)=>{
    const {title, description, coordinates, address, creator} = req.body;
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location:coordinates,
        address,
        creator
    }
    dummy_places.push(createdPlace);
    console.log("added")
    res.status(201).json(createdPlace);
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
