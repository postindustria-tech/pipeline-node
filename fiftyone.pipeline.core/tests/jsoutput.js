/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2022 51 Degrees Mobile Experts Limited, Davidson House,
 * Forbury Square, Reading, Berkshire, United Kingdom RG1 3EU.
 *
 * This Original Work is licensed under the European Union Public Licence
 * (EUPL) v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 * 
 * If using the Work as, or as part of, a network application, by 
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading, 
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

fiftyoneDegreesManager = function() {
    'use-strict';
    var json = {"nullValueReasons":{"testengine.four":"This property is not available"},"javascriptProperties":["testengine.three"],"testengine":{"one":1,"two":2,"three":"console.log('ok')","four":null}};

    // Log any errors returned in the JSON object.
    if(json.error !== undefined){
        console.log(json.error);
    }
    // Set to true when the JSON object is complete.
    var completed = false;

    // changeFuncs is an array of functions. When onChange is called and passed
    // a function, the function is registered and is called when processing is
    // complete.
    var changeFuncs = [];

    // Counter is used to count how many pieces of callbacks are expected. Every
    // time the completedCallback method is called, the counter is decremented
    // by 1. The counter's initial value is 1 as the method is always called
    // once to continue execution.
    var callbackCounter = 1;

    // startsWith polyfill.
    var startsWith = function(source, searchValue){
        return source.lastIndexOf(searchValue, 0) === 0;
    }

    // Get cookies with the '51D_' prefix that have been added to the request
    // and return the data as key value pairs. This method is needed to extract
    // cookie values for inclusion in the GET or POST request for situations
    // where CORS will prevent cookies being sent to third parties.
    var getFodCookies = function(){
        var keyValuePairs = document.cookie.split(/; */);
        var fodCookies = [];
        for(var i = 0; i < keyValuePairs.length; i++) {
            var name = keyValuePairs[i].substring(0, keyValuePairs[i].indexOf('='));
            if(startsWith(name, "51D_")){
                var value = keyValuePairs[i].substring(keyValuePairs[i].indexOf('=')+1);
                fodCookies[name] = value;
            }
        }
        return fodCookies;
    };

    // Extract key value pairs from the '51D_' prefixed cookies and concatenates
    // them to form a query string for the subsequent json refresh.
    var getParametersFromCookies = function(){
        var fodCookies = getFodCookies();
        var keyValuePairs = [];
        for (var key in fodCookies) {
            if (fodCookies.hasOwnProperty(key)) {
                keyValuePairs.push(key+"="+fodCookies[key]);
            }
        }
        return keyValuePairs;
    };

    // Delete a cookie.
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Fetch a value safely from the json object. If a key somewhere down the
    // '.' separated hierarchy of keys is not present then 'undefined' is
    // returned rather than letting an exception occur.
    var getFromJson = function(key) {
        var result = undefined;
        if (typeof(key) === 'string') {
            var functions = json;
            var segments = key.split('.');
            var i = 0;
            while (functions !== undefined && i < segments.length) {
                functions = functions[segments[i++]];
            }
            if (typeof(functions) === "string") {
                result = functions;
            }
        }
        return result;
    }

    // Executed at the end of the processJSproperties method or for each piece
    // of JavaScript which has 51D code injected. When there are 0 pieces of
    // JavaScript left to process then reload the JSON object.
    var completedCallback = function(resolve, reject){
        callbackCounter--;
        if (callbackCounter === 0){
        } else if (callbackCounter < 0){
            reject('Too many callbacks.');
        }
    }

    // Executes any Javascript contained in the json data. Sets the processedJs
    // flag to true when there is no further Javascript to be processed.
    var processJSproperties = function(resolve, reject) {
        if (json.javascriptProperties !== undefined){
            if (json.javascriptProperties.length > 0) {

                // Execute each of the Javascript property code snippets using the
                // index of the value to access the value to avoid problems with
                // JavaScript returning erroneous values.
                for(var index = 0;
                    index < json.javascriptProperties.length;
                    index++) {

                    var name = json.javascriptProperties[index];

                    // Create new function bound to this instance and execute it.
                    // This is needed to ensure the scope of the function is
                    // associated with this instance if any members are altered or
                    // added. Avoids global scoped variables.
                    var body = getFromJson(name);

                    if (body !== undefined) {
                        var func = undefined;
                        var searchString = '// 51D replace this comment with callback function.';

                        if(body.indexOf(searchString) !== -1){
                            callbackCounter++;
                            body = body.replace(/\/\/ 51D replace this comment with callback function./g, 'callbackFunc(resolveFunc, rejectFunc);');
                            func = new Function('callbackFunc', 'resolveFunc', 'rejectFunc',
							    "try {\n" +
							    body + "\n" +
							    "} catch (err) {\n" +
							    "console.log(err);" +
							    "}"
						    );
                            func(completedCallback, resolve, reject);
                        } else {
                            func = new Function(
							    "try {\n" +
							    body + "\n" +
							    "} catch (err) {\n" +
							    "console.log(err);" +
							    "}"
						    );
                            func();
                        }
                    }
                }
            }
        }
        completedCallback(resolve, reject);
    };


    // Check if the JSON object still has any JavaScript snippets to run.
    var hasJSFunctions = function() {
        for (var i = i; i < json.javascriptProperties; i++) {
            var body = getFromJson(json.javascriptProperties[i]);
            if (body !== undefined && body.length > 0) {
                return true;
                }
        }
        return false;
    }

    // Process the JavaScript properties.
    var process = function(resolve, reject){
        processJSproperties(resolve, reject);
    }


    // Function logs errors, used to 'reject' a promise or for error callbacks.
    var catchError = function(value) {
        console.log(value.message || value);
    }

    // Populate this instance of the FOD object with getters to access the
	// properties. If the value is null then get the noValueMessage from the
	// JSON object corresponding to the property.
    var update = function(data){
        var self = this;
        Object.getOwnPropertyNames(data).forEach(function(key) {
            self[key] = {};
            for(var i in data[key]){
                var obj = self[key];
                (function(i) {
                    Object.defineProperty(obj, i, {
                        get: function (){
                            if(data[key][i] === null && (i !== "javascriptProperties" || i !== "nullValueReasons")){
                                return data.nullValueReasons[key+'.'+i];
                            } else {
                                return data[key][i];
                            }
                        }
                    })
                })(i);
            }
        });
    }

	this.onChange = function(resolve) {
		changeFuncs.push(resolve);
        if(started === false){
            process(resolve, catchError);
            started = true;
        }
	}

    this.complete = function(resolve) {
        if(completed){
            resolve(this);
        }else{
            var parent = this;
            process(resolve, catchError);
        }
    };

    // Update this instance with the initial JSON payload.
    update.call(this, json);
    this.complete(json);
}

var fod = new fiftyoneDegreesManager();