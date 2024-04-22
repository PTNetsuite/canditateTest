define('customization.Configuration.Model', [
    'underscore'
], function customizationConfiguration(
    _
) {
    // Holds the DB data as cache for an execution
    var configuration = null;
    return {
        get: function get(includeSecret) {
            var configClone;
            // if first time in this thread
            if (!configuration) {
                // writes to the variable cache for the session
                configuration = this.getFromDB();
            }

            // https://developers.google.com/customization/docs/faq#id-like-to-run-automated-tests-with-customization.-what-should-i-do
            if (configuration.testMode) {
                configuration.siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
                configuration.secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
            }

            // clone the config so we can safely delete secret key if needed from the output
            // this is needed for publishing the config to the frontend
            configClone = JSON.parse(JSON.stringify(configuration));

            if (includeSecret !== true) {
                delete configClone.secretKey;
                delete configClone.ip;
                delete configClone.testMode;
                delete configClone.logSuccess;
                delete configClone.logFailure;
                delete configClone.siteVerifyAPI;
            }

            return configClone;
        },
        getFromDB: function getFromDB() {
            // Commerce API - Obtain domain and website to look config for.
            // Exactly the same as config module does.

            // eslint-disable-next-line no-undef
            var session = nlapiGetWebContainer().getShoppingSession();
            var effectiveSiteId = session.getSiteSettings(['siteid']).siteid;
            var columns = [
                new nlobjSearchColumn('internalid'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_secretkey'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_sitekey'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_login'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_register'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_guest'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_ordersubmit'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_ipaddr'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_enabled'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_testmode'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_log_failures'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_log_success'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_api_siteverify'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_api_js'),
                new nlobjSearchColumn('custrecord_acs_wr_rc_custom_tpl')
            ];

            var filters = [
                ['custrecord_acs_wr_rc_website', 'is', effectiveSiteId],
                'AND',
                // Turning off domain
                // ['custrecord_acs_wr_rc_domain', 'is', effectiveDomain],
                // 'AND',
                ['isinactive', 'is', 'F']
            ];
            var result = {};
            var mappedResults;
            var searchResults;

            searchResults = nlapiSearchRecord('customrecord_acs_wr_customization_config', null, filters, columns);

            mappedResults = _.map(searchResults, function eachRowToMap(row) {
                return {
                    internalid: row.getValue('internalid'),
                    secretKey: row.getValue('custrecord_acs_wr_rc_secretkey'),
                    siteKey: row.getValue('custrecord_acs_wr_rc_sitekey'),
                    l: row.getValue('custrecord_acs_wr_rc_login') === 'T',
                    r: row.getValue('custrecord_acs_wr_rc_register') === 'T',
                    g: row.getValue('custrecord_acs_wr_rc_guest') === 'T',
                    o: row.getValue('custrecord_acs_wr_rc_ordersubmit') === 'T',
                    ip: row.getValue('custrecord_acs_wr_rc_ipaddr') === 'T',
                    enabled: row.getValue('custrecord_acs_wr_rc_enabled') === 'T',
                    useCustomTpl: row.getValue('custrecord_acs_wr_rc_custom_tpl') === 'T',
                    testMode: row.getValue('custrecord_acs_wr_rc_testmode') === 'T',
                    logSuccess: row.getValue('custrecord_acs_wr_rc_log_success') === 'T',
                    logFailure: row.getValue('custrecord_acs_wr_rc_log_failures') === 'T',
                    siteVerifyAPI: row.getValue('custrecord_acs_wr_rc_api_siteverify'),
                    jsAPI: row.getValue('custrecord_acs_wr_rc_api_js')
                };
            });
            result = mappedResults && mappedResults.length === 1 ? mappedResults[0] : null;
            if (!result) {
                result = {
                    enabled: false
                };
            }
            return result;
        }
    };
});
