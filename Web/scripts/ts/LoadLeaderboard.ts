(function () {
    if (document.readyState === "complete") {
        initPage();
    } else {
        document.addEventListener("DOMContentLoaded",(ev: Event) => {
            initPage();
        });
    }

    function initPage() {

        GlobalNav.GlobalNavBuilder.buildNav();

        var header = document.createElement("h2");
        var currentEvent = sessionStorage.getItem("currentEvent") || "Event";
        header.innerHTML = "Leaderboard <small>" + currentEvent + "</small>";
        header.style.color = "#4E9A06";
        document.body.appendChild(header);

        var list = PlayerSummaryList.PlayerSummaryListBuilder.buildList();
        document.body.appendChild(list);
    }

})();
