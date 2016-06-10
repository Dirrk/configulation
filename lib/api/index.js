'use strict';

var register = function registerApi (server, options, next) {

    // Register routes
    // * GET /api/tags - retrieve uniq tags
    // * GET /api/tags/{tagName} - retrieve uniq values for tag
    // * PUT /api/tags/{tagName}/{tagValue} - create new value for tag and create tag if non existent

    // * GET /api/featues - Search for features
    // * GET /api/features/{featureKey} - Get Info on a single feature
    // * POST /api/features/{featureKey}
    // * DELETE /api/features/{featureKey}

    // * GET /api/apps - retrieve uniq apps
    // * PUT /api/apps/{appName} - create new app

    // * GET /configure/app/{app} - Get configuration for app using tags


    /**
     * @typedef {Object} Feature
     * @property {string} title - Title of the feature / setting
     * @property {string} key - Key of the feature / setting
     * @property {string} type - Type of value (boolean/string/object/number)
     * @property {string} app - The app that this feature / setting is for
     * @property {Array<FeatureValue>} values - Array of FeatureValues
     * @property {Array<AuditLog>} audit - Array of audiot log (future release)
     */

     /**
      * @typedef {Object} FeatureValue
      * @property {string} name - Name of the value
      * @property {boolean} isDefault - If true will return this value in case of 0 tags for app or if a tie
      * @property {boolean|string|number|object} value - the value
      * @property {Array<Tag>} tags - tags associated with this value
      */

      /**
       * @typedef {Object} Tag
       * @property {string} name - Tag identifier
       * @property {string} value - The value to search for
       * @property {number} weight - Number between -100 and +100
       */

       // /configure?host=nodejs11&env=dev&group=2&app=mx

       server.bind(options);
       server.route(require('./routes'));
       next();
};

module.exports = register;

module.exports.attributes = {
    version: '1.0.0',
    name: 'api'
};
