'use strict';

const internals = {},
      Joi = require('joi');

internals.fields = {
    key: 1,
    title: 1,
    type: 1,
    app: 1,
    'values.name': 1,
    'values.value': 1,
    'values.is_default': 1
};

module.exports = function searchFeature (req, reply) {

    let searchFeatureRequest = {
        app: req.query.app,
        title: req.query.title,
        page: req.query.page,
        size: req.query.size
    };

    internals.searchFeature(this.mongo, searchFeatureRequest)
        .then(reply)
        .catch((e) => {
            console.log(e);
            throw e;
        });
};

module.exports.ApiConfig = {
    validate: {
        query: Joi.object().keys({
            app: Joi.string(),
            title: Joi.string(),
            page: Joi.number().min(1).default(1),
            size: Joi.number().min(10).default(25)
        })
    }
};

internals.searchFeature = function searchFeature (db, request) {

    let collection = db.collection('dorsal'),
        skip,
        query = {};

    skip = (request.page - 1) * request.size;

    if (request.app) {
        query.app = {
            $regex: new RegExp('.*' + request.app + '.*'),
            $options: 'i'
        };
    }
    if (request.title) {
        query.title = {
            $regex: new RegExp('.*' + request.title + '.*'),
            $options: 'i'
        };
    }

    return collection.find(query, internals.fields)
        .skip(skip).limit(request.size).toArray();
};
