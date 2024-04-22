define('ACS.customization.Terms.View', [
    'customization.Adapter',
    'Backbone',
    'underscore',
    'acs_customization_terms.tpl'
], function ACScustomizationTermsView(
    Adapter,
    Backbone,
    _,
    acscustomizationTermsTpl
) {
    'use strict';

    return Backbone.View.extend({
        template: acscustomizationTermsTpl,
        initialize: function initialize() {
            var self = this;
            Adapter.initializedPromise.then(function aftercustomizationInit() {
                self.configuration = Adapter.configuration;
                self.render();
            });
        },
        getContext: function getContext() {
            var key = "This site is protected by customization and the Google <a target=\"_blank\" href=\"$(0)\">Privacy Policy</a> and <a target=\"_blank\" href=\"$(1)\">Terms of Service</a> apply.";
            var environmentComponent = this.application.getComponent('Environment');
            var session = environmentComponent.getSession();
            var sessionLocale = session && session.language && session.language.locale;
            var translations = environmentComponent.getConfig('extraTranslations');
            var extraTranslation = _.findWhere(translations, { key: key });
            var finalText = (extraTranslation && extraTranslation[sessionLocale]);
            if (!finalText || finalText === '') {
                finalText = key;
            }
            return {
                isEnabled:
                    this.configuration &&
                    this.configuration.get('enabled') &&
                    this.configuration.get('useCustomTpl'),
                mode: this.options.mode,
                privacyText: finalText,
                privacyLink: 'https://policies.google.com/privacy',
                termsLink: 'https://policies.google.com/terms'
            };
        }
    });
});
