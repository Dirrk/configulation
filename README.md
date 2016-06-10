Configulation
=====

Configulation is an Application Configuration Manager that was designed to manage feature flags for production environments.  On application start up, your app simply needs to call configulation with a HTTP GET /configure and configulation will provide a json object to be used as the configuration for the app.  configulation provides a basic UI for managing these settings and can be configured to use mongo or a json file store.
