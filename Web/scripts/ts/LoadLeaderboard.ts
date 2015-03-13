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

        GlobalNav.GlobalNavBuilder.buildNav(headerContainer);

        var header = document.createElement("h2");
        var currentEvent = sessionStorage.getItem("currentEvent") || "Event";
        header.innerHTML = "Leaderboard <small>" + currentEvent + "</small>";
        header.style.color = "#4E9A06";
        document.body.appendChild(header);

        var list = PlayerSummaryList.PlayerSummaryListBuilder.buildList();
        document.body.appendChild(list);
    }

})();
