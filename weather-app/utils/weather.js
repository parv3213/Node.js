const request = require ('request');

const weather = (lantitude, longitude, callback) => {
    url = `https://api.darksky.net/forecast/485cfcf31eb3d1b3dfc7e2649b87be1b/${encodeURIComponent(lantitude)},${encodeURIComponent(longitude)}?units=si`;

    request( {url, json :true}, (error, { body }) => {
        if (error){
            callback('Unable to connect to weather service!',undefined);
        } else if ( body.error ){
            callback('Unable to find Location!',undefined);
        } else {
            const data = body.currently;
            callback(undefined,`it is currently ${data.temperature} degree out. There is ${data.precipProbability} percent chances of rain.`);
        }
    });
}

module.exports = weather