/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
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

class RequestClient {
    post(url, data, origin) {
    
        return new Promise(function (resolve, reject) {
            const request = require('request');

            var httpOptions = {
                url: url,
                headers: {
                },
                form: data
            };

            if(origin) {        
                httpOptions.headers['Origin']= origin;
            }

            request.post(httpOptions, function (err, httpResponse, body) { 
                if (err) {
                    reject(err); // todo message?
                }
                if (httpResponse.statusCode > 399) {
                    // If response from cloud is not 2**, reject with error
                    reject(body);
                }
                else {
                    resolve(body);
                }
            })
        });
    }

    get(url, origin) {
        let httpModule;

        if (url.indexOf('https') !== -1) {
            httpModule = require('https');
        } else {
            httpModule = require('http');
        }
            
        return new Promise(function (resolve, reject) {
            var httpOptions = {
                method: 'GET'
            };
            if(origin) {        
                httpOptions.headers = {
                    'Origin': origin
                }
            }

            httpModule.get(url, httpOptions, function (resp) {
                let data = '';
    
                resp.on('data', (chunk) => {
                    data += chunk;
                });
    
                resp.on('end', () => {
                    // If response from cloud is not 2**, reject with error
                    if (resp.statusCode > 399) {
                        reject(data);
                    } else {
                        resolve(data);
                    }
                });
            }).on('error', (err) => {
                reject(err.message);
            });
        });
    }
}

module.exports = RequestClient;