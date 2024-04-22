define('ACS.customization.EntryPoint', [
    'ACS.customization.Terms.View',
    'ACS.customization.TermsAndConditionsHook',
    'ACS.customization.GuestCheckoutHook',
    'ACS.customization.LoginHook',
    'ACS.customization.OrderSubmitHook',
    'ACS.customization.RegistrationHook'
], function ACScustomizationEntryPoint(
    TermsView,
    TermsAndConditions,
    GuestCheckout,
    Login,
    OrderSubmit,
    Registration
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            // The 3 Account session actions:
            GuestCheckout.mountToApp(application);
            Login.mountToApp(application);
            Registration.mountToApp(application);

            // Terms and conditions handling for Register/login page
            TermsAndConditions.mountToApp(application);

            // Checkout
            OrderSubmit.mountToApp(application);

            TermsView.prototype.application = application;
        }
    };
});
