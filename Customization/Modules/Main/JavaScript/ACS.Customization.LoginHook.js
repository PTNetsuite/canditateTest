define('ACS.customization.LoginHook', [
    'customization',
    'Backbone',
    'jQuery',
    'underscore'
], function ACScustomizationLoginHook(
    customization,
    Backbone,
    jQuery,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var loginRegisterComponent = application.getComponent('LoginRegisterPage');
            var layout = application.getComponent('Layout');
            var customization = new customization({
                configKey: 'l'
            });

            layout.on('afterShowContent', function afterShowContent(viewName) {
                _.defer(function deferedShowContent() {
                    var $placeholder;
                    var $neighbor;
                    if (viewName !== 'LoginRegister.View') {
                        return;
                    }

                    $placeholder = jQuery('<div class="login-register-login-customization"></div>');
                    $neighbor = jQuery('.login-register-login-form-messages');
                    $placeholder.insertAfter($neighbor);
                    customization.attachTo($placeholder[0]);
                    loginRegisterComponent.on('beforeLogin', function beforeRegistration() {
                        var promise = jQuery.Deferred();
                        customization.validate(function onSuccess() {
                            promise.resolve();
                        }, function onError(e) {
                            console.log(e);
                            promise.reject(e);
                        });
                        return promise;
                    });
                });
            });
        }
    };
});
