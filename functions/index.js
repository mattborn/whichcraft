const functions = require('firebase-functions');
// const ba = require('beeradvocate-api');
const rp = require('request-promise');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const searchBrews = name => {
    return rp({
        uri: 'https://api.brewerydb.com/v2/search',
        qs: {
            key: 'cc87a58ccd4b8ed61b28f8978a47593c',
            q: name,
            withBreweries: 'Y',
            type: 'beer',
            format: 'json'
        },
        json: true
    });
};

exports.searchBrews = functions.https.onRequest((request, response) => {
    return searchBrews(request.query.s).then(data => {
        response.send(data.data.slice(5));
    });
});

exports.addBrewData = functions.database.ref('brews/{brewId}').onWrite(event => {
    const brewData = event.data.val();
    console.log(`Searching BreweryDB for ${brewData.name}`);

    return searchBrews(brewData.name).then(brews => {
        const brew = brews.data[0];
        console.log(`Found data for: ${brew.name}`);

        return event.data.ref.update({
            abv: brew['abv'] ? brew['abv'] : '',
            style: brew['style'] ? brew['style']['name'] : ''
        });
    });
});
