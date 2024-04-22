/*
Implemented in SuiteScript 1 in order not to implement things twice
since the validation will happen in SS1.0 anyway
 */
define('customization.Configuration.ServiceController', [
    'customization.Configuration.Model',
    'ServiceController'
], function customizationConfigurationModel(
    Model,
    ServiceController
) {
    'use strict';

    return ServiceController.extend({
        name: 'customization.Configuration.Model',
        get: function get() {
            return Model.get();
        }
    });
});
