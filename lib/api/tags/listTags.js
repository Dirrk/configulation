'use strict';

const internals = {};

module.exports = function listTags (req, reply) {

    internals.getUniqTags(this.mongo)
        .done(reply, reply);
};

module.exports.ApiConfig = {};

internals.getUniqTags = function getUniqTags (db) {

    let collection = db.collection('dorsal');

    return collection.distinct('values.tags.name');
};
