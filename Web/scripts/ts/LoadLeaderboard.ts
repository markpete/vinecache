if (document.readyState === "complete") {
    initPage();
} else {
    document.addEventListener("DOMContentLoaded",(ev: Event) => {
        initPage();
    });
}

function initPage() {
    GlobalNav.GlobalNavBuilder.buildNav();
    var header = document.createElement("h1");
    header.innerText = "Leaderboard";
    document.body.appendChild(header);
    var list = PlayerSummaryList.PlayerSummaryListBuilder.buildList();
    document.body.appendChild(list);
}