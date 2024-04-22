define('ACS.customization.Checkout.OrderWizard.Module', [
    'customization',
    'jQuery',
    'ACS.customization.Terms.View',
    'Wizard.Module',
    'underscore',
    'acs_customization_checkout_order_wizard_module.tpl'
], function ACScustomizationCheckoutOrderWizardModule(
    customization,
    jQuery,
    TermsView,
    WizardModule,
    _,
    acscustomizationCheckoutOrderWizardModuleTpl
) {
    'use strict';

    var Module = WizardModule.extend({
        template: acscustomizationCheckoutOrderWizardModuleTpl,
        childViews: {
            'ACS.OrderSubmit.TermsPlaceholder': function renderChildView() {
                return new TermsView({ mode: 'ordersubmit' });
            }
        },
        deferredInitialization: function deferredInitialization() {
            var self = this;
            this.customization = new customization({
                configKey: 'o'
            });
            self.cart.on('beforeSubmit', function beforeSubmitHandler() {
                var promise = jQuery.Deferred();
                // There are 2 order submit buttons.
                // Without this, in mobile, customization shows funky when you click
                // on the button that is not inside the summary
                jQuery(document).on(
                    'focusin.acscustomizationcheckout',
                    'iframe[src*="customization"]',
                    function onFocusInOfcustomization(event) {
                        jQuery('html, body').animate({
                            scrollTop: jQuery(event.currentTarget).offset().top }, 500);
                    }
                );
                self.customization.validate(
                    function onValidatedcustomization(val) {
                        jQuery(document).off('.acscustomizationcheckout');
                        self.$('[name="custbody_acs_wr_rc_response"]')
                            .val(val)
                            .trigger('change');
                        _.defer(function finalRender() {
                            promise.resolve();
                        });
                    },
                    function onError(e) {
                        jQuery(document).off('.acscustomizationcheckout');
                        promise.reject(e);
                        _.defer(function oncustomizationErrorScrollToMessage() {
                            jQuery('html, body').animate({
                                scrollTop: jQuery('[data-type="alert-placeholder-step"]').offset().top - 50 }, 500);
                        });
                    }
                );
                return promise;
            });
            this.checkout.on('afterShowContent', function afterShowContent() {
                jQuery.when(
                    self.checkout.getCurrentStep(),
                    self.customization.getSetupPromise()
                ).then(function onStep(step) {
                    if (step.url === 'review') {
                        self.customization.attachTo(self.$('#acs-customization-checkout-placeholder')[0]);
                    }
                });
            });
        }
    });
    var originalRender = Module.prototype.render;

    Module.prototype.render = function render() {
        var self = this;
        var originalArgs = arguments;
        if (!this.customization) {
            this.deferredInitialization();
        }
        originalRender.apply(self, originalArgs);
    };
    return Module;
});
