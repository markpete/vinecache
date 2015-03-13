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
                    player.id = result.id;
                    promises.push(result.relation("Person").query().find()
                        .then((results: Parse.Object[]) => {
                        if (results && results.length > 0) {
                            var person = results[0];
                            player.name = person.get("Name");
                        }
                    }));
                    promises.push(result.relation("Videos").query().find()
                        .then((results: Parse.Object[]) => {
                        results.forEach((result) => {
                            var video = new Video();
                            var file: Parse.File = result.get("Video");
                            video.url = file.url();
                            player.videos.push(video);
                        });
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

            var videosSection = document.createElement("div");
            videosSection.id = "videos_" + player.id;
            videosSection.className = "collapse";
            var videosWell = document.createElement("div");
            videosWell.className = "well";
            videosSection.appendChild(videosWell);

            var videosRow = document.createElement("div");
            videosRow.className = "row";
            player.videos.forEach((value) => {
                this.insertVideo(videosRow, value);
            });
            videosWell.appendChild(videosRow);

            var collapseButton = document.createElement("button");
            collapseButton.type = "button";
            collapseButton.className = "btn btn-primary";
            collapseButton.setAttribute("data-toggle", "collapse");
            collapseButton.setAttribute("data-target", "#" + videosSection.id);
            collapseButton.setAttribute("aria-expanded", "false");
            collapseButton.setAttribute("aria-controls", videosSection.id);
            collapseButton.style.cssFloat = "right";
            collapseButton.innerText = "Videos..."

            var badge = document.createElement("span");
            badge.className = "badge";
            badge.innerText = player.score.toString();

            item.appendChild(collapseButton);
            item.appendChild(badge);
            item.appendChild(videosSection);

            return item;
        }

        private insertVideo(row: HTMLDivElement, video: Video) {
            var videoCol = document.createElement("div");
            videoCol.className = "col-xs-6 col-md-3";

            var thumbnail = document.createElement("div");
            thumbnail.className = "thumbnail";

            var videoElement = document.createElement("video");
            videoElement.src = video.url;
            videoElement.className = "img-responsive";
            videoElement.addEventListener("click",(ev: MouseEvent) => {
                ModalVideo.Instance.show((<HTMLVideoElement>ev.currentTarget).src);
            });
            thumbnail.appendChild(videoElement);

            videoCol.appendChild(thumbnail);
            row.appendChild(videoCol);
        }
    }

    class Person {
        name: string;
    }

    class Video {
        location: string;
        url: string;
    }

    class Player {
        id: string;
        score: number;
        person: Person;
        videos: Video[];
        constructor(person: Person, score: number) {
            this.person = person;
            this.score = score;
            this.videos = [];
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
