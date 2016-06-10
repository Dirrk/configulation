'use strict';

const internals = {},
      MongoClient = require('mongodb').MongoClient,
      BPromise = require('bluebird');

module.exports = function Mongo (config) {

    if (internals.isSetup) {
        return BPromise.resolve(internals.mongodb);
    }

    config.options.promiseLibrary = BPromise;

    return MongoClient.connect(config.url, config.options)
        .then((db) => {
            internals.mongodb = db;
            internals.isSetup = true;
            return db;
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
};

module.exports.disconnect = function disconnect () {
    if (internals.mongodb) {
        internals.mongodb.close();
    }
};
