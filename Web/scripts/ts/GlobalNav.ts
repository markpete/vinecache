function initNav() {

    var linkTag = document.createElement("link");
    linkTag.rel = "stylesheet";
    linkTag.href = "../stylesheets/respon-nav.css";
    var scriptTagHdr = document.createElement("script");
    scriptTagHdr.type = "text/javascript";
    scriptTagHdr.src = "responsive-nav.js";
    document.head.appendChild(linkTag);
    document.head.appendChild(scriptTagHdr);

    var navContainer = document.createElement("div");
    navContainer.id = "nav";
    navContainer.className = "nav-collapse";

    var navItems= {
        Map: "home.html",
        Leaders: "leaderboard.html"
    }

    var list = document.createElement("ul");
    var listItem;
    for (var property in navItems) {
        if (navItems.hasOwnProperty(property)) {
            listItem = document.createElement("li");
            var aTag = document.createElement("a");
            aTag.innerText = property;
            aTag.href = navItems[property];
            listItem.appendChild(aTag);
            list.appendChild(listItem);
        }
    }
    navContainer.appendChild(list);
    var scriptTag = document.createElement("script");
    scriptTag.innerText = "var nav = responsiveNav('#nav');"
    navContainer.appendChild(scriptTag);
    document.body.appendChild(navContainer);
}