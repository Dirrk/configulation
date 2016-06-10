'use strict';

const internals = {},
      Joi = require('joi'),
      _ = require('lodash');

module.exports = function configureApp (req, reply) {

    let configureAppRequest = {
        tags: req.query,
        app: req.params.appName
    };

    configureAppRequest.names = _.keys(configureAppRequest.tags).map(_.toLower);
    configureAppRequest.values = _.values(configureAppRequest.tags).map(_.toLower);

    internals.configureApp(this.mongo, configureAppRequest)
        .then(reply)
        .catch((e) => {
            console.log(e);
            throw e;
        });
};

module.exports.ApiConfig = {
    validate: {
        params: Joi.object().keys({
            appName: Joi.string().required().lowercase()
        })
    }
};

internals.configureApp = function configureApp (db, request) {

    let collection = db.collection('dorsal'),
        query = {
          $and: [
            {
              app: request.app
            },
            {
              $or: [
                {
                  'values.is_default': true
                },
                {
                  $and: [
                    {
                      'values.tags.name': {
                        $in: request.names
                      }
                    },
                    {
                      'values.tags.value': {
                        $in: request.values
                      }
                    }
                  ]
                }
              ]
            }
          ]
        };

    return collection.find(query).toArray()
        .map((doc) => {

            let ret,
                def,
                valueCounts;

            ret = { key: doc.key };

            def = _.find(doc.values, 'is_default');

            valueCounts = doc.values.map((vals) => {

                let count = 0;

            });

        });
};
