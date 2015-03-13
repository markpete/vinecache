///<reference path="../types/node/node.d.ts" />
///<reference path="../types/googleMaps/googleMaps.d.ts" />
(function () {
    if (document.readyState === "complete") {
        initPage();
    } else {
        document.addEventListener("DOMContentLoaded",(ev: Event) => {
            initPage();
        });
    }

    function initPage() {
        var headerContainer = document.createElement("div");
        headerContainer.className = "page-header";
        document.body.appendChild(headerContainer);

        var eventInfo = sessionStorage.getItem("currentEvent");
        var title = (eventInfo || "Event")

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
})();

