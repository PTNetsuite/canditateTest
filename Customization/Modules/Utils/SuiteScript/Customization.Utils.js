define('customization.Utils', [

], function customizationUtils(

) {
    return {
        getIPSafe: function getIPSafe() {
            var ip = null;
            if (!request) {
                return ip;
            }
            try {
                ip = request.getHeader('true-client-ip') || request.getHeader('ns-client-ip');
            } catch (e) {
                nlapiLogExecution('ERROR', 'Error fetching IP', e);
            }
            return ip;
        },
        getUserAgentSafe: function getUserAgentSafe() {
            var ua = null;
            if (!request) {
                return ua;
            }
            try {
                ua = request.getHeader('user-agent');
            } catch (e) {
                nlapiLogExecution('ERROR', 'Error fetching user agent', e);
            }
            return ua;
        },
        getCollectionObjectByPropertyValue: function getCollectionObjectByPropertyValue(arr, prop, val) {
            var i;
            var iLen;
            for (i = 0, iLen = arr.length; i < iLen; i++) {
                if (arr[i][prop] === val) return arr[i];
            }
            return undefined;
        }
    };
});
