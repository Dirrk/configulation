'use strict';

var config = require('./config'),
    api = require('./api'),
    Hapi = require('hapi'),
    mongodb = require('./mongo'),
    server;

server = new Hapi.Server(config.hapi.init);

server.connection(config.hapi.connection);

mongodb(config.mongo)
    .then(function (mongo) {

        const bind = {
            config: config,
            mongo: mongo,
            logger: console.log
        };
        server.bind(bind);

        server.register(
            [
                require('inert'),
                {
                    register: api,
                    options: bind
                }
            ],
            () => {
                server.start(() => { console.log('Listening'); });
            }
        );

        server.route([
            { method: 'GET', path: '/{params*}', handler: { directory: config.hapi.www}}
        ]);
    });
