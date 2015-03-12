/// <reference path="../types/parse/parse.d.ts" />
///<reference path="../types/node/node.d.ts" />
///<reference path="../types/googleMaps/googleMaps.d.ts" />
var MapModule;
(function (MapModule) {
    var Map = (function () {
        function Map() {
            this._markers = [];
        }
        Map.prototype.initializeMap = function () {
            google.maps.event.addDomListener(window, 'load', this.initializeMapInternal.bind(this));
        };
        Map.prototype.initializeMapInternal = function () {
            var internalMap = this;
            internalMap._map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: new google.maps.LatLng(0, 0),
                zoom: 3
            });
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            var query = new Parse.Query("Node");
            console.log(internalMap);
            var result = query.find({
                success: function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        internalMap.createMarker(place);
                    }
                    internalMap._map.setZoom(15);
                    internalMap._map.setCenter(internalMap._markers[0].getPosition());
                },
                error: function (error) {
                    // error is an instance of Parse.Error.
                }
            });
        };
        Map.prototype.createMarker = function (place) {
            var placeLoc = new google.maps.LatLng(place.attributes.Coordinates.latitude, place.attributes.Coordinates.longitude);
            var marker = new google.maps.Marker({
                map: this._map,
                position: placeLoc
            });
            this._markers.push(marker);
            google.maps.event.addListener(marker, 'click', function () {
                alert(place.name);
            });
        };
        return Map;
    })();
    MapModule.Map = Map;
})(MapModule || (MapModule = {}));
