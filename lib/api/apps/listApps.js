'use strict';

const internals = {};

module.exports = function listApps (req, reply) {

    internals.getUniqApps(this.mongo)
        .done(reply, reply);
};

module.exports.ApiConfig = {};

internals.getUniqApps = function getUniqApps (db) {

    let collection = db.collection('dorsal');

    return collection.distinct('app');
};
