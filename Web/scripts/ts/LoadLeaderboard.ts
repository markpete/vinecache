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
        var list = PlayerSummaryList.PlayerSummaryListBuilder.buildList();
        document.body.appendChild(list);
    }

})();
