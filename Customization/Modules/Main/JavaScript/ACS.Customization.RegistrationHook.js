define('ACS.customization.RegistrationHook', [
    'customization',
    'Backbone',
    'jQuery',
    'underscore'
], function ACScustomizationRegistrationHook(
    customization,
    Backbone,
    jQuery,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var registerPage = application.getComponent('LoginRegisterPage');
            var layout = application.getComponent('Layout');
            var customization = new customization({
                configKey: 'r'
            });

            layout.addChildView('Register.CustomFields', function customizationPlaceHolderView() {
                var View = Backbone.View.extend({
                    template: function template() {
                        return '<div data-id="Register-customization-Placeholder"></div>';
                    }
                });
                return new View();
            });

            layout.on('afterShowContent', function afterShowContent(viewName) {
                var $bestPlaceholder;
                var $finalPlaceholder;
                var $element;
                var $neighbor;
                if (viewName !== 'LoginRegister.View') {
                    return;
                }

                _.defer(function() {
                    /*
                   It's desired to hook onto Register.CustomFields child view.
                   However, not all themes have it, hence the workaround
                   of looking at the form validation placeholder otherwise
                    */
                    $bestPlaceholder = jQuery('[data-id="Register-customization-Placeholder"]');
                    if ($bestPlaceholder.length !== 0) {
                        $finalPlaceholder = $bestPlaceholder;
                    } else {
                        $element = jQuery('<div data-id="Register-customization-Placeholder"></div>');
                        $neighbor = jQuery('.login-register-register-form-messages');
                        $element.insertAfter($neighbor);
                        $finalPlaceholder = $element;
                    }

                    customization.attachTo($finalPlaceholder[0]);
                });

            });

            registerPage.on('beforeRegister', function beforeRegistration() {
                var promise = jQuery.Deferred();
                customization.validate(
                    function onSuccess() {
                        promise.resolve();
                    },
                    function onError(e) {
                        console.log(e);
                        promise.reject(e);
                    }
                );
                return promise;
            });
        }
    };
});
