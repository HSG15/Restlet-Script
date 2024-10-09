/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/auth', 'N/file', 'N/log', 'N/record', 'N/url'],
    /**
 * @param{auth} auth
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{url} url
 */
    (auth, file, log, record, url) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // GET method to retrieve an existing record
        const get = (requestParams) => {
            try {
                var so_id = requestParams.so_id_postman;
                var so_record = record.load({
                    type: record.Type.SALES_ORDER,
                    id: so_id,
                    isDynamic: true,
                });

                log.debug('Record retrieved: ', so_record);
                return so_record;
            } catch (e) {
                return {
                    success: false,
                    message: e.message
                };
            }
        };

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // PUT method to update a record
        const put = (requestBody) => {
            try {
                log.debug('Request body: ', requestBody);

                var sales_order = record.load({
                    type: record.Type.SALES_ORDER,
                    id: requestBody.sales_order_id,
                    isDynamic: true
                });

                var newEntity = requestBody.entity;
                sales_order.setValue({
                    fieldId: 'entity',
                    value: newEntity
                });

                var updated_so_id = sales_order.save();
                log.debug('Sales order updated with ID: ', updated_so_id);

                return {
                    success: true,
                    updated_so_id: updated_so_id
                };
            } catch (e) {
                return {
                    success: false,
                    message: e.message
                };
            }
            // {
            //     "sales_order_id": 23327,
            //     "entity": 534
            // }
        };

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // POST method to create a new record
        const post = (requestBody) => {
            try {
                log.debug('Request body: ', requestBody);

                var sales_order = record.create({
                    type: record.Type.SALES_ORDER,
                    isDynamic: true,
                    defaultValues: {
                        entity: requestBody.entity
                    }
                });

                requestBody.items.forEach(function (item) {
                    sales_order.selectNewLine({
                        sublistId: 'item'
                    });

                    sales_order.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item.itemid
                    });

                    sales_order.commitLine({
                        sublistId: 'item'
                    });
                });

                var sales_order_id = sales_order.save();
                log.debug('Sales order created with ID: ', sales_order_id);

                return {
                    success: true,
                    sales_order_id: sales_order_id
                };
            } catch (e) {
                return {
                    success: false,
                    message: e.message
                };
            }

            // {
            //     "entity": 534,
            //     "items": [
            //         {
            //             "itemid": 338
            //         }
            //     ]
            // }
        };

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        // DELETE method to delete an existing record
        const doDelete = (requestParams) => {
            var so_id_dlt = requestParams.so_id_to_dlt
            log.debug('so id to delete ', so_id_dlt)
            try{
                var deleted_id = record.delete({
                    type: record.Type.SALES_ORDER,
                    id: so_id_dlt
                })
                log.debug('Sales order deleted with id ', id)
                return {
                    success: true,
                    deleted_so_id: deleted_id
                }
            }catch(e){
                return{
                    success: false,
                    message: e.message
                }
            }
        }

        return { get, put, post, delete: doDelete }

    });