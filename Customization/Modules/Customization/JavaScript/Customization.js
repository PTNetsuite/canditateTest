define('customization', [
    'customization.Adapter',
    'underscore'
], function customizationDef(
    Adapter,
    _
) {
    /*
    customization class to be instanciated by different widgets
    Interfaces with the actual customization adapter.
     */
    var customization = function customization(settings) {
        this.settings = settings;
        Adapter.initialize();
    };

    _.extend(customization.prototype, {
        attachTo: function attachTo(selector) {
            Adapter.installInstance(this.settings.configKey, selector);
        },
        validate: function validate(successCallbackFn, errorCallbackFn) {
            Adapter.validate(this.settings.configKey, successCallbackFn, errorCallbackFn);
        },
        getSetupPromise: function getSetupPromise() {
            return Adapter.initializedPromise;
        },
        getConfig: function getConfig() {
            return Adapter.configuration;
        }
    });

    return customization;
});
