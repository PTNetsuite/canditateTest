define('ACS.customization.Account.Hook', [
    'Application',
    'customization.Configuration.Model',
    'customization.Adapter'
], function ACScustomizationAccountHook(
    Application,
    Configuration,
    Adapter
) {
    'use strict';

    var serviceMethodsToProtect = [
        { listenerName: 'Account.Register.ServiceController.post', configKey: 'r', actionString: 'register' },
        { listenerName: 'Account.Login.ServiceController.post', configKey: 'l', actionString: 'login' },
        { listenerName: 'Account.RegisterAsGuest.ServiceController.post', configKey: 'g', actionString: 'guest' }
    ];

    serviceMethodsToProtect.forEach(function registerServiceProtection(s) {
        Application.on('before:' + s.listenerName, function onEachListener(Service) {
            // eslint-disable-next-line no-undef
            var customerObj = nlapiGetWebContainer().getShoppingSession().getCustomer();
            var config = Configuration.get();
            var configValue = config[s.configKey];
            var data = Service.data || {};
            var result;

            // We don't need to trigger customization once guest chooses to register an account after placing an order.
            // At this point, they already went through customization validation twice.
            if (s.listenerName === 'Account.Register.ServiceController.post' && customerObj && customerObj.isGuest()) {
                return;
            }
            if (config.enabled && configValue) {
                result = Adapter.validate(s.actionString, data['g-customization-response']);
                if (!result.success) {
                    throw result;
                }
            }
        });
    });
});
