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
        var masterDiv = document.createElement("div");

        var eventInfo = sessionStorage.getItem("currentEvent");
        var title = (eventInfo || "Event")

        GlobalNav.GlobalNavBuilder.buildNav();

        var header = document.createElement("h2");
        header.innerText = title;
        header.style.color = "#4E9A06";
        masterDiv.appendChild(header);

        var mapDiv = document.createElement("div");
        mapDiv.id = "map-canvas";
        //masterDiv.appendChild(mapDiv);
        document.body.appendChild(masterDiv);
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

