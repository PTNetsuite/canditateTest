
function service(request, response)
{
	'use strict';
	try
	{
		require('customization.Configuration.ServiceController').handle(request, response);
	}
	catch(ex)
	{
		console.log('customization.Configuration.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
