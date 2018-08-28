const api = 'https://api.foursquare.com/v2'
const proxyurl = "https://sheltered-headland-14246.herokuapp.com/";

function handleErrors(response){
    if(!response.ok){
        throw Error(response.statusText)
    }
    return response
}

export const getLocationsAll = () => fetch(`${api}/venues/search?ll=38.7223,-9.1393&intent=browse&radius=10000&query=restaurante&client_id=QAWJK0ZYULD4APYQV3OYHEKCMNZMFCXIB4X5JCFGMQBWOBWS&client_secret=HXWURVMXOMTWNRZV5MZ551M5KWVZG0OUUDFXFRPNKXD1ELGA&v=20180816`)
           .then(handleErrors)
           .then(res => res.json())
           .then(data => data.response.venues);

export const getVenueDetails = (venueId) => {
    let venueDetailsUrl = [`/venues/${venueId}?`,
        `client_id=QAWJK0ZYULD4APYQV3OYHEKCMNZMFCXIB4X5JCFGMQBWOBWS`,
        `&client_secret=HXWURVMXOMTWNRZV5MZ551M5KWVZG0OUUDFXFRPNKXD1ELGA&v=20180824`].join("")

        console.log(venueDetailsUrl);

    return fetch(`${api}${venueDetailsUrl}`)
        .then(res => res.json())
        .then(data => data.response.venue)
    }

export const getPlaceIdByGeocoding = (latlng) => {
    let geoCodeUrl = [`https://maps.googleapis.com/maps/api/geocode/json?`, `latlng=${latlng.lat},${latlng.lng}&language=en&`, `KEY=AIzaSyDctg6f7jzezClyz9iHNwgXEYm1uLQwMJk`].join("");

    return fetch(geoCodeUrl)
        .then(res => res.json())
        .then(data => data)
        .catch(error => {
            console.log(error)
        });
}
/*Get Place Details using Google Maps API using place_id*/
export const getPlaceDetails = (place_id) => {

    let placeDetailsUrl = [`https://maps.googleapis.com/maps/api/place/details/json?language=en`, `&placeid=${place_id}`, `&key=AIzaSyDctg6f7jzezClyz9iHNwgXEYm1uLQwMJk`].join("");

    return fetch(proxyurl + placeDetailsUrl)
        .then(res => res.json())
        .then(data => data.result)
        .catch(error => {
            console.log(error)
        })
}
export const getPlacePhoto = (photo_reference) => {
    let photoReferenceUrl = [`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400`, `&photoreference=${photo_reference}`, `&key=AIzaSyDctg6f7jzezClyz9iHNwgXEYm1uLQwMJk`].join("");
    return fetch(proxyurl + photoReferenceUrl)
        .then(res => res.blob())
        .catch(error => {
            console.log('Error while getting Place Photo', error)
        })
}