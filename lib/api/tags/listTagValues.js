'use strict';

const internals = {};

module.exports = function listTagValues (req, reply) {

    internals.getUniqTagValues(this.mongo, req.params.tagName)
        .done(reply, reply);
};

module.exports.ApiConfig = {};

internals.getUniqTagValues = function getUniqTagValues (db, tagName) {

    let collection = db.collection('dorsal');

    return collection.distinct('values.tags.value', { 'values.tags.name': tagName });
};
