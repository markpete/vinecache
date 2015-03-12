/// <reference path="../types/parse/parse.d.ts" />
///<reference path="../types/node/node.d.ts" />
///<reference path="../types/googleMaps/googleMaps.d.ts" />
module MapModule {

    export class Map {
        _markers: google.maps.Marker[];
        _map: google.maps.Map;
        constructor() {
            this._markers = [];
        }


        initializeMap() {
            google.maps.event.addDomListener(window, 'load', this.initializeMapInternal.bind(this));
        }

        private initializeMapInternal() {
            var internalMap = this;
            
            internalMap._map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: new google.maps.LatLng(0, 0),
                zoom: 3
            });
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            var query = new Parse.Query("Node");

            var result = query.find({
                success: (results) => {

                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        console.log(place);
                        var placeLoc = new google.maps.LatLng(place.attributes.Coordinates.latitude, place.attributes.Coordinates.longitude);
                        var markerContent = document.createElement("div");

                        var markerTitle = document.createElement("h3");
                        markerTitle.innerText = place.attributes.Name;
                        markerTitle.setAttribute("style", "text-align: center;");
                        markerContent.appendChild(markerTitle);

                        var video = document.createElement("video");
                        video.setAttribute("src", place.attributes.Video.url());
                        video.setAttribute("width", "100%");
                        video.setAttribute("height", "100%");
                        markerContent.appendChild(video);

                        console.log(markerContent.outerHTML);
                        var infoWindow = new google.maps.InfoWindow({
                            maxWidth: window.innerWidth * 0.3,
                            maxHeight: window.innerHeight * 0.25,
                        });

                        var marker = new google.maps.Marker({
                            map: internalMap._map,
                            position: placeLoc,
                            title: place.attributes.Name
                        });

                        google.maps.event.addListener(marker, 'click',(function (marker, content, infowindow) {
                            return function () {
                                infowindow.setContent(content);
                                infowindow.open(internalMap._map, marker);
                            };
                        })(marker, markerContent.outerHTML, infoWindow)); 

                        internalMap._markers.push(marker);
                    }
                    internalMap._map.setZoom(15);
                    internalMap._map.setCenter(internalMap._markers[0].getPosition());
                },

                error: function (error) {
                    // error is an instance of Parse.Error.
                }
            });
        }
    }
}