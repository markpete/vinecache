/// <reference path="../types/parse/parse.d.ts" />

module ListUtilities {
	interface ListItemProvider {
		addItems(list: HTMLUListElement): void
	}

	class ListBuilder {
		private itemProvider: ListItemProvider;
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

	class EventListItemProvider implements ListItemProvider {
		constructor() {
			Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "uVOwgMNsmE8l2D47IiM179B3RLJnJdRGKAWZvR5j");
		}
		addItems(list: HTMLUListElement) {
			this.queryEvents().then((eventNames: string[]) => {
				eventNames.forEach((name: string) => { list.appendChild(this.buildItem(name)); });
			});
		}

		private queryEvents() {
			//var Event = Parse.Object.extend("Event");
			//var query = new Parse.Query(Event);
			//return query.find().then(
			//	(results: any[]) => {
			//		var eventNames: string[] = [];
			//		if (results && results.length > 0) {
			//			results.forEach((object: Parse.Object) => { eventNames.push(object.get("Name")); });
			//		}
			//		return Parse.Promise.as(eventNames);
			//	},
			//	(reason: Parse.Error) => {
			//		alert(reason.message);
			//		return Parse.Promise.error(reason);
			//	});
			return Parse.Promise.as(["First", "Second", "Third"]);
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
