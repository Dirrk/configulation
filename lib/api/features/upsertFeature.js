'use strict';

const internals = {},
      Joi = require('joi'),
      _ = require('lodash');

module.exports = function upsertFeature (req, reply) {

    let upsertFeatureRequest = req.payload;

    upsertFeatureRequest.key = req.params.featureKey;

    internals.upsertFeature(this.mongo, upsertFeatureRequest)
        .then(reply)
        .catch((e) => {
            console.log(e);
            throw e;
        });
};

internals.schemas = {
    tags: Joi.array().required().items(
        Joi.object().keys({
            name: Joi.string().required().lowercase().regex(/^[a-z0-9\_\-]*$/i),
            value: Joi.string().required().lowercase().regex(/^[a-z0-9\_\-]*$/i),
            weight: Joi.number().min(-100).max(100).default(10)
        }).required()
    )
};
internals.schemas.items = {
    boolean: Joi.object().keys(
        {
            name: Joi.string().required(),
            value: Joi.boolean().required(),
            is_default: Joi.boolean().default(false),
            tags: internals.schemas.tags
        }
    ).required(),
    number: Joi.object().keys(
        {
            name: Joi.string().required(),
            value: Joi.number().required(),
            is_default: Joi.boolean().default(false),
            tags: internals.schemas.tags
        }
    ).required(),
    string: Joi.object().keys(
        {
            name: Joi.string().required(),
            value: Joi.string().required(),
            is_default: Joi.boolean().default(false),
            tags: internals.schemas.tags
        }
    ).required(),
    object: Joi.object().keys(
        {
            name: Joi.string().required(),
            value: Joi.object().required(),
            is_default: Joi.boolean().default(false),
            tags: internals.schemas.tags
        }
    ).required()
};

module.exports.ApiConfig = {
    validate: {
        params: Joi.object().keys({
            featureKey: Joi.string().required().lowercase().regex(/^[a-z0-9\_\-]*$/i)
        }),
        payload: Joi.object().keys({
            title: Joi.string().required(),
            type: Joi.string().lowercase().required().valid(['boolean', 'number', 'string', 'object']),
            app: Joi.string().lowercase().required(),
            values: Joi.alternatives()
                    .when('type', { is: 'boolean', then: Joi.array().min(1).required().items(internals.schemas.items.boolean) })
                    .when('type', { is: 'number', then: Joi.array().min(1).required().items(internals.schemas.items.number) })
                    .when('type', { is: 'string', then: Joi.array().min(1).required().items(internals.schemas.items.string) })
                    .when('type', { is: 'object', then: Joi.array().min(1).required().items(internals.schemas.items.object) }),
            version: Joi.number().min(1).default(0)
        })
    }
};

internals.upsertFeature = function upsertFeature (db, request) {

    let collection = db.collection('dorsal'),
        query = { key: request.key };

    return collection.findOne(query)
        .then((doc) => {

            // It found the document but the version was different send back the newest doc
            if (doc && doc.version !== request.version) {
                return {
                    success: false,
                    message: 'No changes were made because, the feature was modified by another user.  We have attempted to merge them, to cancel just refresh.',
                    original: doc,
                    changes: request,
                    feature: _.merge(doc, request)
                };
            }

            // Increase the version
            request.version++;
            request.last_modified = new Date();

            if (!doc) {
                request.audit = [{ time: new Date(), action: 'Create'}];
            } else {
                request.audit = doc.audit || [];
                request.audit.push({ time: new Date(), action: 'Updated values' });
            }

            // Store as json blob
            request.values.map((val) => {
                if (request.type === 'object') {
                    val.value = JSON.stringify(val.value);
                }
            });

            return collection.updateOne(query, { $set: request }, { j: true, upsert: true })
                .then(() => {
                    return {
                        success: true,
                        feature: request
                    };
                });
        });
};
