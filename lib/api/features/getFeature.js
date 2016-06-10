'use strict';

const internals = {};

internals.fields = {
    title: 1,
    key: 1,
    type: 1,
    values: 1,
    app: 1,
    version: 1,
    last_modified: 1
};

module.exports = function getFeature (req, reply) {

    internals.getFeature(this.mongo, req.params.featureKey)
        .then(reply)
        .catch((e) => {
            console.log(e);
            throw e;
        });
};

module.exports.ApiConfig = {};

internals.getFeature = function getFeature (db, key) {

    let collection = db.collection('dorsal');

    return collection.findOne({ key: key }, { fields: internals.fields});
};
