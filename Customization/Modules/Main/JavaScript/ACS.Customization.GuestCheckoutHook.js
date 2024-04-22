define('ACS.customization.GuestCheckoutHook', [
    'customization',
    'jQuery',
    'underscore'
], function ACScustomizationGuestCheckoutHook(
    customization,
    jQuery,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var layout = application.getComponent('Layout');
            var customization = new customization({
                configKey: 'g'
            });

            layout.on('afterShowContent', function afterShowContent(viewName) {
                var $form;
                var isCallReady = false;
                var $placeholder;
                var $neighbor;
                if (viewName !== 'LoginRegister.View') {
                    return;
                }
                _.defer(function deferShowContent() {
                    $placeholder = jQuery('<div class="login-register-checkout-as-guest-form-customization-placeholder"></div>');
                    $neighbor = jQuery('.login-register-checkout-as-guest-form-messages');
                    $placeholder.insertAfter($neighbor);

                    customization.attachTo($placeholder[0]);
                    $form = jQuery('.login-register-checkout-as-guest-form');

                    // No "beforeGuestCheckout" event - so using jQuery to hook instead
                    $form.submit(function wrapWithcustomization() {
                        if (isCallReady === true) {
                            return true;
                        }
                        customization.validate(
                            function onValidatedcustomization() {
                                isCallReady = true;
                                $form.submit();
                                isCallReady = false;
                            },
                            function oncustomizationAbort(e) {
                                console.error(e);
                            }
                        );
                        return false;
                    });
                });
            });
        }
    };
});
