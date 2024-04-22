define('ACS.customization.OrderSubmitHook', [
    'ACS.customization.Checkout.OrderWizard.Module'
], function ACScustomizationOrderSubmitHook(
    Module
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var checkout = application.getComponent('Checkout');
            checkout.addModuleToStep({
                step_url: 'review',
                module: {
                    id: 'acscustomizationresponse',
                    index: 99,
                    classname: 'ACS.customization.Checkout.OrderWizard.Module',
                    options: {
                        container: '#wizard-step-content-right'
                    }
                }
            });
            Module.prototype.cart = application.getComponent('Cart');
            Module.prototype.checkout = checkout;
        }
    };
});
