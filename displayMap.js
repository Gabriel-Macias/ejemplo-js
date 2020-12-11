
/*  function name: displayMap
    description:
    1. Call Geocoding API to verify that the location is correct (partial_match != true and status: ok)
    2. Convert latitude and longitude to NOSE coordinates
    3. Call Earthquake API to get earthquakes in those coordinates
    4. Call Google Maps API to display the map centered at the city with the other 10 earthquakes shown with markers and info
    5. Update search log history

    parameters: none
    return: none
*/

var map;

function displayMap() {
    const cityName = document.getElementById("cityName").value;
    // check city name is provided
    if (cityName === "") {
        alert("Please enter a city name or location.");
    } else {

        const APIkey = "AIzaSyD4mIiEokVzr--ae22_CurC3Eeeq0y4gTQ";
        let cityAddress = cityName.replace(" ", "%20");
        let geocodeAPIurl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityAddress}&key=${APIkey}`;

        // Call Google Geocoding API
        fetch(geocodeAPIurl)
        .then((response) => response.json())
          .then(function(data) {
            if (data.status != "OK" || "partial_match" in data.results[0]){
                throw "Error!";
            } else {

                // Add the location name to search history
                var ul = document.getElementById("searchHistory");
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(cityName));
                ul.appendChild(li);

                // The location of the city
                const cityLoc = {lat: data.results[0].geometry.location.lat, 
                                 lng: data.results[0].geometry.location.lng};

                // The map, centered at the location
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 10,
                    center: cityLoc,
                });

                let north = data.results[0].geometry.bounds.northeast.lat;
                let east = data.results[0].geometry.bounds.northeast.lng;
                let south = data.results[0].geometry.bounds.southwest.lat;
                let west = data.results[0].geometry.bounds.southwest.lng;

                // To avoid the Mixed content error
                const corsUrl = "https://cors-anywhere.herokuapp.com/"
                const earthAPIurl = "http://api.geonames.org/earthquakesJSON?username=Lorius2&maxRows=10";

                return fetch(corsUrl + earthAPIurl + `&north=${north}&south=${south}&east=${east}&west=${west}`, {
                    headers: {"X-Requested-With": "earthquakeMaps"}
                });
            }    

          })
          .then((response) => response.json())
          .then(function(data) {
            // Adding the markers for the earthquakes
            var infowindow = new google.maps.InfoWindow();
            var marker, i, loc;

            for (i = 0; i < data.earthquakes.length; i++) {
                loc = {lat: data.earthquakes[i].lat, lng: data.earthquakes[i].lng}
                marker = new google.maps.Marker({
                    position: {lat: data.earthquakes[i].lat, lng: data.earthquakes[i].lng},
                    map: map
                });

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(`Date: ${data.earthquakes[i].datetime} - Magnitude: ${data.earthquakes[i].magnitude}`);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
          }
        })
          .catch(function(err) {
            // console.log(err);
            alert("There was an error with the request. Verify the location name and try again.");
          })
    }
}