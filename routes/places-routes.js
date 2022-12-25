const express = require('express')

const router = express.Router();

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
        creator: 'u1'
    }
]
router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = dummy_places.find(p => {
        return p.id === placeId;
    })
    if (!place) {
        const error = new Error('Could not find a place for the provided id')
        error.code = 404;
        throw error;
    }
    res.json({
        place
    });
})

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const place = dummy_places.find(p => {
        return p.creator === userId;
    })
    if (!place) {
        const error = new Error('Could not find a place for the provided user id.');
        error.code = 404;
        return next(error);
    }
    res.json({
        place
    });
})
module.exports = router;