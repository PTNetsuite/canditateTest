define('ACS.customization.TermsAndConditionsHook', [
    'jQuery',
    'ACS.customization.Terms.View',
    'customization.Adapter'
], function ACScustomizationTermsAndConditionsHook(
    jQuery,
    TermsView,
    customizationAdapter
) {
    return {
        mountToApp: function mountToApp(application) {
            var initializePromise = customizationAdapter.initializedPromise;
            var layout = application.getComponent('Layout');

            // Terms & conditions in login/register
            layout.on('afterShowContent', function afterShowContent(viewName) {
                initializePromise.then(function aftercustomizationInit() {
                    var config = customizationAdapter.configuration;
                    if (
                        // show only if at least one of the three registration/login/gc page widgets is enabled
                        (config.isEnabled('r') || config.isEnabled('l') || config.isEnabled('g')) &&
                        config.get('useCustomTpl')
                    ) {
                        if (viewName !== 'LoginRegister.View') {
                            return;
                        }

                        jQuery('.login-register').append(new TermsView({
                            mode: 'loginregister'
                        }).render().$el);
                    }
                });
            });
        }
    };
});
