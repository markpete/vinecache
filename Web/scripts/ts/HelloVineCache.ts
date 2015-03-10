document.addEventListener("DOMContentLoaded", (ev: Event) => {
    var title = document.title

    var header = document.createElement("h1");
    header.innerText = title;
    var description = document.createElement("p");
    description.innerText = "Welcome to " + title;

    document.body.appendChild(header);
    document.body.appendChild(description);
});

