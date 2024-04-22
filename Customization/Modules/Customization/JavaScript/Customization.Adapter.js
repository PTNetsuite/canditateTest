define('customization.Adapter', [
    'customization.Configuration.Model',
    'jQuery',
    'underscore',
    'Utils'
], function customizationAdapter(
    ConfigurationModel,
    jQuery,
    _,
    Utils
) {
    'use strict';

    var customizationAPI = {};
    var customizationIds = {};
    var customizationStatus = {};
    var registeredCallbacks = {};
    var registeredErrorCallbacks = {};
    var activeId;

    return {
        configuration: null,
        configurationPromise: jQuery.Deferred(),
        initializedPromise: jQuery.Deferred(),
        initialized: false,
        getThirdPartyScriptURL: function getThirdPartyScriptURL() {
            return this.configuration.get('jsAPI')
                .replace('{{CALLBACK}}', '__callbackFromcustomizationACS');
        },
        loadScript: function loadScript() {
            var self = this;
            // eslint-disable-next-line no-underscore-dangle
            window.__callbackFromcustomizationACS = function __callbackFromcustomizationACS() {
                customizationAPI = window.gcustomization;
                self.initializedPromise.resolve();
            };
            jQuery.getScript(this.getThirdPartyScriptURL());
            return this.initializedPromise;
        },
        initialize: function initialize() {
            var self = this;
            if (!this.initialized) {
                this.initialized = true;
                this.configuration = new ConfigurationModel();
                this.configuration.fetch().then(function onFetch() {
                    if (self.configuration.get('enabled')) {
                        self.loadScript();
                    }
                    self.configurationPromise.resolve();
                    if (!self.configuration.get('enabled')) {
                        self.initializedPromise.resolve();
                    }
                });
            }
            this.boundCancelationEventHandler = _.bind(this.cancelationEventHandler, this);
        },
        installInstance: function installInstance(id, containerElement) {
            var self = this;
            var lastId = customizationIds[id];
            var callBackFn;

            if (!jQuery.contains(window.document, containerElement)) {
                return; // if element is not in DOM, then we don't append customization
            }

            /* instead of actually setting the real final callback to customization
            we register a proxy callback. This allows for more flexibility over how to register customizations
            and when to trigger the validation.
             */
            callBackFn = function fnCallback(customizationKey) {
                customizationStatus[id] = 'solved';

                if (self.configuration.get('enabled')) {
                    self.deRegisterCancelationListener();
                }

                if (typeof registeredCallbacks[id] === 'function') {
                    try {
                        registeredCallbacks[id](customizationKey);
                    } catch (e) {
                        console.error(e);
                    }
                }

                registeredErrorCallbacks[id] = null;
                registeredCallbacks[id] = null;
            };
            self.initializedPromise.then(function onConfigReady() {
                if (!self.configuration.isEnabled(id)) {
                    return;
                }

                if (lastId !== undefined) {
                    customizationAPI.reset(lastId);
                }

                customizationIds[id] = customizationAPI.render(
                    containerElement,
                    {
                        sitekey: self.configuration.get('siteKey'),
                        badge: 'bottomright',
                        size: 'invisible', // ,
                        callback: callBackFn,
                        'expired-callback': function expiredcallback() {
                            self.cancelationHandler(id);
                        },
                        'error-callback': function errorcallback() {
                            self.cancelationHandler(id);
                        }
                    }
                );

            });
        },
        validate: function validate(id, callbackFn, errorCallbackFn) {
            var self = this;
            var customizationToValidate = customizationIds[id];
            registeredCallbacks[id] = callbackFn;
            registeredErrorCallbacks[id] = errorCallbackFn;

            self.initializedPromise.then(function onConfigReady() {
                if (!self.configuration.isEnabled(id)) {
                    if (typeof registeredCallbacks[id] === 'function') {
                        try {
                            registeredCallbacks[id]('notEnabled');
                        } catch (e) {
                            console.error(e);
                        }
                    }
                } else {
                    if (customizationStatus[id] === 'solved') {
                        customizationAPI.reset(customizationToValidate);
                    }

                    activeId = id;
                    _.defer(function() {
                        self.registerCancelationListener();
                    })
                    customizationAPI.execute(customizationIds[id]);
                }
            });
        },
        registerCancelationListener: function registerCancelationListener() {
            jQuery(document)
                .on('click.acscustomization', this.boundCancelationEventHandler)
                .on('focusout.acscustomization', 'iframe[src*="customization"]', this.boundCancelationEventHandler);
        },
        deRegisterCancelationListener: function deRegisterCancelationListener() {
            jQuery(document)
                .off('.acscustomization');
        },
        cancelationEventHandler: function cancelationEventHandler() {
            this.cancelationHandler(activeId);
        },
        cancelationHandler: function cancelationHandler(id) {
            var cancelationCallback = registeredErrorCallbacks[id];
            this.deRegisterCancelationListener();
            if (id) {
                registeredErrorCallbacks[id] = null;
                registeredCallbacks[id] = null;
            }
            if (typeof cancelationCallback === 'function') {
                try {
                    cancelationCallback({
                        errorCode: 'ERR_customization',
                        errorMessage: Utils.translate('Please Complete customization')
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };
});
