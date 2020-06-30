const request = require ('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoicGFydjMyMTMiLCJhIjoiY2sxZ3B1djB5MDRyMTNwbnJtc2p0dW13MyJ9.8slTwCgfiQTuJcmkfKJ0rA&limit=1`;
    
    request({ url, json:true}, (error, { body }={}) => {
        if (error){
            callback('Unable to connect to network!', undefined);
        } else if (body.message ){
            callback(('Wrong URL'), undefined);
        } else if (body.features.length === 0){
            callback('Unable to find the location',undefined);
        } else {
            const data = body.features[0];
            callback(undefined, {
                lantitude:data.center[1],
                longitude:data.center[0],
                location: data.place_name
            });
        }
    });
    
}

module.exports= geocode;
