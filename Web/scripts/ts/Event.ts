﻿///<reference path="../types/node/node.d.ts" />
///<reference path="../types/googleMaps/googleMaps.d.ts" />

if (document.readyState === "complete") {
    initPageNew();
} else {
    document.addEventListener("DOMContentLoaded",(ev: Event) => {
        initPageNew();
    });
}

function initPageNew() {
    var eventInfo = JSON.parse(sessionStorage.getItem("currentEvent"));
    var title = (eventInfo && eventInfo.Name || "Event")

    GlobalNav.GlobalNavBuilder.buildNav();
    var header = document.createElement("h1");
    header.innerText = title;
    document.body.appendChild(header);
    
    var description = document.createElement("p");
    description.innerText = "Welcome to " + title;
    document.body.appendChild(description);

    var mapDiv = document.createElement("div");
    mapDiv.id = "map-canvas";
    document.body.appendChild(mapDiv);
    (new MapModule.Map()).initializeMap(); 
    //window.addEventListener('load', function () {
    //    if (document.getElementById('map')) {

    //                new google.maps.Map(document.getElementById('map'), {
    //                    center: new google.maps.LatLng(0, 0),
    //                    zoom: 3
    //                });
         
    //    }
    //}, false);
    // 
}
