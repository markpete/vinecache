if (document.readyState === "complete") {
    initPage();
} else {
    document.addEventListener("DOMContentLoaded", (ev: Event) => {
        initPage();
    });
}

function initPage() {
    var title = document.title

    var headerContainer = document.createElement("div");
    headerContainer.className = "page-header";
    var header = document.createElement("h1");
    header.style.color = "green";
    header.innerText = title;
    headerContainer.appendChild(header);
    
    document.body.appendChild(headerContainer);

    var container = document.createElement("div");
    container.className = "container-fluid";

    var row = createRow();

    var imgCol = createColumn(4);
    var image = document.createElement("img");
    image.className = "img-responsive";
    image.src = "/images/flower-vine-hi.png";
    imgCol.appendChild(image);
    
    var listCol = createColumn(8);
    var listHeader = document.createElement("h2");
    var listHeaderSmall = document.createElement("small");
    listHeaderSmall.innerText = "Choose an event to manage:";
    listHeader.appendChild(listHeaderSmall);
    listCol.appendChild(listHeader);

    var list = ListUtilities.EventListBuilder.buildList();
    listCol.appendChild(list);

    var button = document.createElement("button");
    button.type = "button";
    button.innerText= "OK";
    button.onclick=function () {
        window.location.href =  './fungus';
    }
    listCol.appendChild(button);

    row.appendChild(imgCol);
    row.appendChild(listCol);

    container.appendChild(row);
    document.body.appendChild(container);

}

function createRow(): HTMLDivElement {
    var row: HTMLDivElement = document.createElement("div");
    row.className = "row";
    return row;
}

function createColumn(width: number): HTMLDivElement {
    var col: HTMLDivElement = document.createElement("div");
    col.className = "col-xs-" + width.toString() +
    " col-sm-" + width.toString() +
    " col-md-" + width.toString();
    return col;
}

