define('customization.Adapter', [
    'customization.Configuration.Model',
    'customization.Utils'
],
function customizationModel(
    Configuration,
    Utils
) {
    'use strict';

    return {
        validate: function validate(action, customizationResponse) {
            var responseBody;
            var responseObj;
            var config = Configuration.get(true);
            var customizationValidationUrl = config.siteVerifyAPI;

            var requestBody = {
                secret: config.secretKey,
                response: customizationResponse,
                remoteip: config.ip ? (Utils.getIPSafe() || undefined) : undefined
            };

            if (!customizationResponse) {
                if (config.logFailure) {
                    nlapiLogExecution('ERROR', 'customization_NONE', JSON.stringify({
                        ipAddress: Utils.getIPSafe(),
                        ua: Utils.getUserAgentSafe(),
                        action: action
                    }));
                }
                throw this.buildAnswer(false, 400, 'NO_customization', 'Please validate customization.');
            }

            try {
                responseObj = nlapiRequestURL(
                    customizationValidationUrl,
                    requestBody, // Important: form-encoded. NOT JSON
                    'POST'
                );
                responseBody = JSON.parse(responseObj.getBody());
            } catch (e) {
                nlapiLogExecution('ERROR', 'Error calling customization-error', e);
                nlapiLogExecution('ERROR', 'Error calling customization-user', JSON.stringify({
                    ipAddress: Utils.getIPSafe(),
                    ua: Utils.getUserAgentSafe(),
                    action: action
                }));
                responseBody = {};
            }

            if (!responseBody.success) {
                if (config.logFailure) {
                    nlapiLogExecution('ERROR', 'customization_FAILURE', JSON.stringify({
                        ipAddress: Utils.getIPSafe(),
                        ua: Utils.getUserAgentSafe(),
                        action: action,
                        responseMessage: responseBody
                    }));
                }
                throw this.buildAnswer(false, 400, 'ERROR', 'Error trying to validate customization.');
            }

            if (config.logSuccess) {
                nlapiLogExecution('ERROR', 'customization_SUCCESS', JSON.stringify({
                    ipAddress: Utils.getIPSafe(),
                    ua: Utils.getUserAgentSafe(),
                    action: action,
                    responseMessage: responseBody
                }));
            }
            return this.buildAnswer(true, 'OK', 'customization Validated');
        },
        buildAnswer: function buildErrorAnswer(success, status, code, message) {
            return {
                success: success,
                status: status,
                code: code,
                message: message
            };
        }
    };
});
