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
    var description = document.createElement("p");
    description.innerText = "Welcome to " + title;

    document.body.appendChild(header);
    document.body.appendChild(description);
}

