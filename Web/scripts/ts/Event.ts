///<reference path="../types/node/node.d.ts" />
///<reference path="../types/googleMaps/googleMaps.d.ts" />

if (document.readyState === "complete") {
    initPageNew();
} else {
    document.addEventListener("DOMContentLoaded",(ev: Event) => {
        initPageNew();
    });
}

function initPageNew() {
    var title = document.title

    var headerContainer = document.createElement("div");
    headerContainer.className = "page-header";
    document.body.appendChild(headerContainer);

    GlobalNav.GlobalNavBuilder.buildNav(headerContainer);

    var header = document.createElement("h2");
    header.innerText = title;
    header.style.color = "#4E9A06";
    document.body.appendChild(header);

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

