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

        private populateNodes(results) {

            var internalMap = this;
            
            internalMap._map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: new google.maps.LatLng(0, 0),
                zoom: 3
            });

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
            if(results == null) {
                internalMap._map.setCenter(new google.maps.LatLng(44,-122));
            }
            else {
                internalMap._map.setCenter(internalMap._markers[0].getPosition());
            }
        }

        private initializeMapInternal() {
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");

            var eventName = sessionStorage.getItem("currentEvent");

            var eventQuery = new Parse.Query("Event");
            eventQuery.equalTo("Name", eventName);
            eventQuery.first({
                success: (results) => {
                    if(results == null) {
                        this.populateNodes(null);
                        return;
                    }
                    var relation = results.relation("Map");
                    var mapQuery = relation.query();
                    mapQuery.first({
                        success: (results) => {
                            if(results == null) {
                                this.populateNodes(null);
                                return;
                            }
                            relation = results.relation("Nodes");
                            var nodeQuery = relation.query();
                            nodeQuery.find({
                                success: (results) => {
                                    this.populateNodes(results);
                                },
                                error: function(error) {
                                    alert("Failure retrieving Map nodes");
                                }
                            });
                        },
                        error: function (error) {
                            alert("Failure retrieving a Map");
                        }
                    });
                },
                error: function (error) {
                    alert("Failure retrieving an Event: " + eventName);
                }
            });
        }
    }
}