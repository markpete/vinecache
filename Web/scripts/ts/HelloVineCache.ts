if (document.readyState === "complete") {
    initPage();
} else {
    document.addEventListener("DOMContentLoaded", (ev: Event) => {
        initPage();
    });
}

function initPage() {
    var title = document.title

    var header = document.createElement("h1");
    header.innerText = title;
    var list = ListUtilities.EventListBuilder.buildList();

    document.body.appendChild(header);
    document.body.appendChild(list);
}

