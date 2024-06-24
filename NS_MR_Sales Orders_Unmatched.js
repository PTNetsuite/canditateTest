/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/file', 'N/error'],
	function(runtime, search, record, email, file, error) {
		var stDepartmentUnmatchedId;
		var stLocationUnmatchedId;

		function getInputData() {
			log.debug('* * *  S t a r t * * * ');
			//get paremeters
			stLocationUnmatchedId = runtime.getCurrentScript().getParameter('custscript_location');
			stDepartmentUnmatchedId = runtime.getCurrentScript().getParameter('custscript_department');

			var arrSalesOrdersFromSearch = [];

			//load the search
			var objSearch = search.load({
				id: 'customsearch_so_unmatched_search'
			});

			objSearch.run().each(function(objResult){
				log.debug(objResult.id);
				//add SO to the array
				arrSalesOrdersFromSearch.push(objResult);
				return true;
			});

			return arrSalesOrdersFromSearch;
		}

		function map(context) {
			log.debug('* * *  S t a r t * * * ');
			var objSalesOrder = JSON.parse(context.value);

			if (objSalesOrder) {
				context.write(objSalesOrder);
			}
		}

		function reduce(context) {
			log.debug('* * *  S t a r t * * * ');
			var objSalesOrder = JSON.parse(context.key);

			var recSalesOrder = record.load({
              type: 'salesorder',
              id: objSalesOrder.id
           	});

			recSalesOrder.setValue('custbody_amount_unmatched', getAmountUnmatched(objSalesOrder.id, stLocationUnmatchedId, new Date(), recSalesOrder.getValue('custbody_customer_category')));
			recSalesOrder.setValue('custbody_unmatched_location', stLocationUnmatchedId);
			recSalesOrder.setValue('department', stDepartmentUnmatchedId);

			log.debug('Value: ' + getAmountUnmatched(objSalesOrder.id, stLocationUnmatchedId, new Date(), recSalesOrder.getValue('custbody_customer_category')));

			var id = recSalesOrder.save({ enableSourcing: true, ignoreMandatoryFields: true });
			log.debug('* * *  E n d  * * * ' + id);
		}

		function getAmountUnmatched(id, location, date, customer){
			/* Assumes this code works */
		}

		return {
			getInputData: getInputData,
			reduce: reduce
		};
	});
