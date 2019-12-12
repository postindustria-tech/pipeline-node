/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

 module.exports = {

    /**
     * Helper to make an HTTP/HTTPS get request and return a promise with the result
     * @param {String} url
    */
    makeHTTPRequest: function (url) {

        let httpModule;

        if (url.indexOf("https") !== -1) {

            httpModule = require("https");

        } else {

            httpModule = require("http");

        }

        return new Promise(function (resolve, reject) {

            httpModule.get(url, function (resp) {

                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    resolve(data);
                });

            }).on("error", (err) => {
                reject(err.message);
            });

        });

    }


};
