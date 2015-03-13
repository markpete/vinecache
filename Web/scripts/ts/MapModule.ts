/// <reference path="../types/parse/parse.d.ts" />
///<reference path="../types/node/node.d.ts" />
///<reference path="../types/googleMaps/googleMaps.d.ts" />
module MapModule {

    //adapded from this example http://code.google.com/apis/maps/documentation/javascript/overlays.html#CustomOverlays
    //text overlays
    function TxtOverlay(pos, txt, cls, map) {

        // Now initialize all properties.
        this.pos = pos;
        this.txt_ = txt;
        this.cls_ = cls;
        this.map_ = map;

        // We define a property to hold the image's
        // div. We'll actually create this div
        // upon receipt of the add() method so we'll
        // leave it null for now.
        this.div_ = null;

        // Explicitly call setMap() on this overlay
        this.setMap(map);
    }

    TxtOverlay.prototype = new google.maps.OverlayView();



    TxtOverlay.prototype.onAdd = function () {

        // Note: an overlay's receipt of onAdd() indicates that
        // the map's panes are now available for attaching
        // the overlay to the map via the DOM.

        // Create the DIV and set some basic attributes.
        var div = document.createElement('DIV');
        div.className = this.cls_;

        div.innerHTML = this.txt_;

        // Set the overlay's div_ property to this DIV
        this.div_ = div;
        var overlayProjection = this.getProjection();
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        // We add an overlay to a map via one of the map's panes.

        var panes = this.getPanes();
        panes.floatPane.appendChild(div);
    }
    TxtOverlay.prototype.draw = function () {


        var overlayProjection = this.getProjection();

        // Retrieve the southwest and northeast coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to resize the DIV.
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);


        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';



    }
    //Optional: helper methods for removing and toggling the text overlay.  
    TxtOverlay.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
    TxtOverlay.prototype.hide = function () {
        if (this.div_) {
            this.div_.style.visibility = "hidden";
        }
    }

    TxtOverlay.prototype.show = function () {
        if (this.div_) {
            this.div_.style.visibility = "visible";
        }
    }

    TxtOverlay.prototype.toggle = function () {
        if (this.div_) {
            if (this.div_.style.visibility == "hidden") {
                this.show();
            }
            else {
                this.hide();
            }
        }
    }

    TxtOverlay.prototype.toggleDOM = function () {
        if (this.getMap()) {
            this.setMap(null);
        }
        else {
            this.setMap(this.map_);
        }
    }

    export class Map {
        _markers: google.maps.Marker[];
        _playerMarkers: google.maps.Marker[];
        _map: google.maps.Map;
        private _eventHelper: EventHelper.EventHelper;
        private _refreshRate: number;

        constructor() {
            this._markers = [];
            this._playerMarkers = [];
            this._refreshRate = 3000;
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            this._eventHelper = new EventHelper.EventHelper();

        }

        initializeMap() {
            google.maps.event.addDomListener(window, 'load', this.initializeMapInternal.bind(this));
        }

        private populateNodes(results) {

            var internalMap = this;

            for (var i = 0; i < results.length; i++) {
                var place = results[i];
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
                video.setAttribute("controls", "");
                markerContent.appendChild(video);

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
            if (results == null) {
                internalMap._map.setCenter(new google.maps.LatLng(44, -122));
            }
            else {
                internalMap._map.setCenter(internalMap._markers[0].getPosition());
            }
        }

        private refreshList() {
            var internalMap = this;
            console.dir(internalMap);
            if (internalMap._playerMarkers.length == 0) {
                internalMap._eventHelper.getPlayerData().then((players: EventHelper.Player[]) => {
                    players.forEach((player: EventHelper.Player) => {
                        var marker = new google.maps.Marker({
                            map: internalMap._map,
                            position: new google.maps.LatLng(0, 0),
                            title: player.name
                        });
                        var customTxt = "<div>Blah blah sdfsddddddddddddddd ddddddddddddddddddddd<ul><li>Blah 1<li>blah 2 </ul></div>";
                        var txt = new TxtOverlay(new google.maps.LatLng(0, 0), customTxt, "customBox", internalMap._map);
                        //var 
                        console.log(marker);
                    });
                });;
            }
        }

        private initializeMapInternal() {

            var internalMap = this;

            internalMap._map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: new google.maps.LatLng(0, 0),
                zoom: 3
            });
            internalMap._map.setZoom(15);
            
            setInterval(this.refreshList.bind(internalMap), internalMap._refreshRate);

            //var eventName = sessionStorage.getItem("currentEvent");
            var eventName = "Microsoft Hunt";
            var eventQuery = new Parse.Query("Event");
            eventQuery.equalTo("Name", eventName);
            console.log(eventName);
            eventQuery.first({
                success: (results) => {
                    if (results == null) {
                        this.populateNodes(null);
                        return;
                    }
                    var relation = results.relation("Map");
                    var mapQuery = relation.query();
                    mapQuery.first({
                        success: (results) => {
                            if (results == null) {
                                this.populateNodes(null);
                                return;
                            }
                            relation = results.relation("Nodes");
                            var nodeQuery = relation.query();
                            nodeQuery.find({
                                success: (results) => {
                    //                this.populateNodes(results);
                                },
                                error: function (error) {
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