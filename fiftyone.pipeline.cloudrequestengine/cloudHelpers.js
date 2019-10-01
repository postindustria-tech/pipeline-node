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
