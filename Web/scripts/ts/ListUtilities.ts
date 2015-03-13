module ListUtilities {
    export interface ListItemProvider {
        addItems(list: HTMLUListElement): void
    }

    export class ListBuilder {
        protected itemProvider: ListItemProvider;
        constructor(ip: ListItemProvider) {
            this.itemProvider = ip;
        }
        buildList() {
            var list: HTMLUListElement = document.createElement("ul");
            list.className = "list-group";
            this.itemProvider.addItems(list);
            return list;
        }
    }
}
