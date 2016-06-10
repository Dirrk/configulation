'use strict';


// Register routes
// * GET /api/tags - retrieve uniq tags
// * GET /api/tags/{tagName} - retrieve uniq values for tag
// * PUT /api/tags/{tagName}/{tagValue} - create new value for tag and create tag if non existent

// * GET /api/featues - Search for features
// * GET /api/features/{featureKey} - Get Info on a single feature
// * POST /api/features/{featureKey}

// * GET /api/apps - retrieve uniq apps
// * GET /api/apps/{appName}/configure - Get configuration for app using tags
// * PUT /api/apps/{appName} - create new app


const apps = require('./apps'),
      features = require('./features'),
      tags = require('./tags');

module.exports = [
    // Apps
    { method: 'GET', path: '/api/apps', handler: apps.listApps, config: apps.listApps.ApiConfig },
    { method: 'GET', path: '/api/apps/{appName}/configure', handler: apps.configureApp, config: apps.configureApp.ApiConfig },
    //
    // Features
    { method: 'GET', path: '/api/features/{featureKey}', handler: features.getFeature, config: features.getFeature.ApiConfig },
    { method: 'GET', path: '/api/features', handler: features.search, config: features.search.ApiConfig },
    { method: 'POST', path: '/api/features/{featureKey}', handler: features.upsertFeature, config: features.upsertFeature.ApiConfig },

    // Tags
    { method: 'GET', path: '/api/tags', handler: tags.listTags, config: tags.listTags.ApiConfig },
    { method: 'GET', path: '/api/tags/{tagName}', handler: tags.listTagValues, config: tags.listTagValues.ApiConfig }
];
