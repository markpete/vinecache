/// <reference path="../types/parse/parse.d.ts" />

module EventList {
    class SingleSelectListBuilder extends ListUtilities.ListBuilder {
        buildList() {
            var list = super.buildList();
            list.addEventListener("click", SingleSelectListBuilder.onListItemClick);
            return list;
        }

        private static onListItemClick(ev: MouseEvent) {
            var list: HTMLUListElement = <HTMLUListElement>ev.currentTarget;
            var items = list.getElementsByTagName("li");
            for (var idx = 0; idx < items.length; idx++) {
                var item: HTMLLIElement = items.item(idx);
                if (item === ev.target || $.contains(item, <Element>ev.target)) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            }
        }
    }

    class EventListItemProvider implements ListUtilities.ListItemProvider {
        constructor() {
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
        }
        addItems(list: HTMLUListElement) {
            this.queryEvents().then((eventNames: string[]) => {
                eventNames.forEach((name: string) => { list.appendChild(this.buildItem(name)); });
            });
        }

        private queryEvents() {
            var Event = Parse.Object.extend("Event");
            var query = new Parse.Query(Event);
            return query.find().then(
                (results: any[]) => {
                    var eventNames: string[] = [];
                    if (results && results.length > 0) {
                        results.forEach((object: Parse.Object) => { eventNames.push(object.get("Name")); });
                    }
                    return Parse.Promise.as(eventNames);
                },
                (reason: Parse.Error) => {
                    alert(reason.message);
                    return Parse.Promise.error(reason);
                });
        }

        private buildItem(name: string) {
            var item = document.createElement("li");
            item.className = "list-group-item";
            item.innerText = name;
            return item;
        }
    }

    export var EventListBuilder = new SingleSelectListBuilder(new EventListItemProvider());
}
