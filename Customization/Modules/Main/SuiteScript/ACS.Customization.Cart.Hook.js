define('ACS.customization.Cart.Hook', [
    'Application',
    'customization.Configuration.Model',
    'customization.Adapter',
    'customization.Utils'
], function ACScustomizationCartHook(
    Application,
    Configuration,
    Adapter,
    Utils
) {
    'use strict';

    /* CartComponent beforeSubmit is NOT working! */
    Application.on('before:LiveOrder.submit', function onBeforeSubmitListener(Model, threedsecure) {
        var config = Configuration.get();
        var result;
        var customFieldValues;
        var customizationField;
        var customizationValue;

        if (threedsecure === true) {
            nlapiLogExecution('ERROR', 'customization_THREED', 'Skipped - 3ds');
            return;
        }
        if (config.enabled && config.o) {
            // eslint-disable-next-line no-undef
            customFieldValues = nlapiGetWebContainer()
                .getShoppingSession()
                .getOrder()
                .getCustomFieldValues();

            customizationField = Utils.getCollectionObjectByPropertyValue(
                customFieldValues || [],
                'name',
                'custbody_acs_wr_rc_response'
            );

            customizationValue = customizationField && customizationField.value;
            result = Adapter.validate('checkout', customizationValue);
            if (!result.success) {
                throw result;
            }
        }
    });
});
