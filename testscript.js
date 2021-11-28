var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.295077, lng: 9.211874},
      zoom: 8
    });

    var geocoder = new google.maps.Geocoder();

    map.addListener('click', (event) => {
      geocoder.geocode({
        location: event.latLng,
      }, (results, status) => {
        if(status === 'OK') {
            if(results && results.length) {
                var filtered_array = results.filter(result => result.types.includes("locality")); 
                var addressResult = filtered_array.length ? filtered_array[0]: results[0];

                if(addressResult.address_components) {
                    addressResult.address_components.forEach((component) => {
                        if(component.types.includes('locality')) {
                            console.log(component.long_name);
                        }
                    });
                }
            }
        }
    });
  });
} 