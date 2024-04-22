/* global getExtensionAssetsPath:false */
define('customization.Configuration.Model', [
    'Backbone', // To keep compatibility Aconcagua-onwards
    'Utils'
], function customizationConfigurationModel(
    Backbone,
    Utils
) {
    return Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/customization.Configuration.Service.ss')),
        isEnabled: function isEnabled(section) {
            return this.get('enabled') && this.get(section);
        }
    });
});
