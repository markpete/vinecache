/// <reference path="../types/parse/parse.d.ts" />

module ListUtilities {
	interface ListItemProvider {
		getItems(): HTMLLIElement[]
	}

	class ListBuilder {
		private itemProvider: ListItemProvider;
		constructor(ip: ListItemProvider) {
			this.itemProvider = ip;
		}
		buildList() {
			var list: HTMLUListElement = document.createElement("ul");
			list.className = "list-group";
			var children: HTMLLIElement[] = this.itemProvider.getItems();
			children.forEach((value: HTMLLIElement) => {
				list.appendChild(value);
			});
			return list;
		}
	}

	class EventListItemProvider implements ListItemProvider {
		constructor() {
			Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "uVOwgMNsmE8l2D47IiM179B3RLJnJdRGKAWZvR5j");
		}
		getItems() {
			var items: HTMLLIElement[] = [];
			items.push(this.buildItem("First"));
			items.push(this.buildItem("Second"));
			items.push(this.buildItem("Third"));
			return items;
		}

		private buildItem(name: string) {
			var item = document.createElement("li");
			item.className = "list-group-item";
			item.innerText = name;
			return item;
		}
	}

	export var EventListBuilder: ListBuilder = new ListBuilder(new EventListItemProvider());
}
