/// <reference path="../types/parse/parse.d.ts" />

module PlayerSummaryList {
    class AutoRefreshListBuilder extends ListUtilities.ListBuilder {
        private _refreshRate: number;
        constructor(ip: ListUtilities.ListItemProvider, refreshRate: number = 30000) {
            super(ip);
            this._refreshRate = refreshRate;
        }
        buildList() {
            var list = super.buildList();
            setInterval(this.refreshList.bind(this, list), this._refreshRate);
            return list;
        }

        private refreshList(list: HTMLUListElement) {
            $(list).empty();
            this.itemProvider.addItems(list);
        }
    }

    class PlayerSummaryProvider implements ListUtilities.ListItemProvider {
        private EventObject = Parse.Object.extend("Event");
        private _eventName: string;
        private _event: Parse.Object;
        private _eventInitialized: boolean;

        constructor(eventName: string) {
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            this._eventName = eventName;
        }

        private get event(): Parse.IPromise<{}> {
            if (this._eventInitialized) {
                return this._event.fetch();
            } else {
                var query = new Parse.Query(this.EventObject);
                query.equalTo("Name", this._eventName);
                return query.find().then(
                    (results: any[]) => {
                        if (results && results.length > 0) {
                            this._event = results[0];
                            this._eventInitialized = true;
                        }
                        return Parse.Promise.as(this._event);
                    });
            }
        }

        addItems(list: HTMLUListElement) {
            this.getPlayerData().then((players: Player[]) => {
                players.forEach((player: Player) => { list.appendChild(this.buildItem(player)); });
            });
        }

        private getPlayerData(): Parse.IPromise<{}> {
            var players: Player[] = []

            return this.event
                // Obtain the players for this event, sorted by score (descending)
                .then((value: Parse.Object): Parse.Promise<Parse.Object[]> => {
                var query = value.relation("Players").query();
                query.descending("Score");
                return query.find();
                })
                // Construct the player and person data for each player and add it to the list
                .then((results: Parse.Object[]) => {
                var promises = [];
                results.forEach((result: Parse.Object) => {
                    var player = new Player(new Person(), result.get("Score"));
                    promises.push(result.relation("Person").query().find()
                        .then((results: Parse.Object[]) => {
                        if (results && results.length > 0) {
                            var person = results[0];
                            player.name = person.get("Name");
                        }
                    }));
                    players.push(player);
                });
                return Parse.Promise.when(promises);
                })
                // Once all player data has been populated, return the list of players
                .then(() => {
                return Parse.Promise.as(players);
                },
                (reason: Parse.Error) => {
                    alert(reason.message);
                    return Parse.Promise.error(reason);
                });
        }

        private buildItem(player: Player) {
            var item = document.createElement("li");
            item.className = "list-group-item";
            item.innerText = player.name;

            var badge = document.createElement("span");
            badge.className = "badge";
            badge.innerText = player.score.toString();
            item.appendChild(badge);

            return item;
        }
    }

    class Person {
        name: string;
    }

    class Player {
        score: number;
        person: Person;
        constructor(person: Person, score: number) {
            this.person = person;
            this.score = score;
        }

        get name(): string {
            return this.person.name;
        }
        set name(value: string) {
            this.person.name = value;
        }
    }

    export var PlayerSummaryListBuilder = new AutoRefreshListBuilder(new PlayerSummaryProvider("Microsoft Hunt"));
}
