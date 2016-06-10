'use strict';

const Path = require('path');

let config = {
    hapi: {
        init: {},
        www: {
            path: Path.resolve(__dirname, '../www'),
            redirectToSlash: true,
            index: true
        },
        connection: {
            host: 'localhost',
            port: 3000,
            address: '0.0.0.0',
            routes: {
                validate: {
                    options: {
                        allowUnknown: true
                    }
                }
            }
        }
    },
    mongo: {
        url: 'mongodb://localhost:27017/configulation',
        options: {}
    }
};


if (process.env.LISTEN_HOST) {
    config.hapi.connection.host = process.env.LISTEN_HOST;
}
if (process.env.LISTEN_PORT) {
    config.hapi.connection.port = process.env.LISTEN_PORT;
}
if (process.env.CONNECTION_ADDRESS) {
    config.hapi.connection.address = process.env.CONNECTION_ADDRESS;
}

module.exports = config;
