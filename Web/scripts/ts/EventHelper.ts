/// <reference path="../types/parse/parse.d.ts" />

module EventHelper {
    
    export class EventHelper {
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

        public getPlayerData(): Parse.IPromise<{}> {
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
                    var player = new Player(new Person(), result.get("Score"), result.get("Coordinates"));
                    player.id = result.id;
                    promises.push(result.relation("Person").query().find()
                        .then((results: Parse.Object[]) => {
                        if (results && results.length > 0) {
                            var person = results[0];
                            player.name = person.get("Name");
                            player.email = person.get("Email");
                            player.facebookID = person.get("FacebookID");
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
    }

    export class Person {
        name: string;
        email: string;
        facebookID: number;
    }
    export class Video {
        location: string;
        url: string;
    }
    export class Player {
        score: number;
        person: Person;
        id: string;
        coordinates: Geolocation;
        videos: Video[];

        constructor(person: Person, score: number, coordinates: Geolocation) {
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

        get email(): string {
            return this.person.email;
        }
        set email(value: string) {
            this.person.email = value;
        }

        get facebookID(): number {
            return this.person.facebookID;
        }
        set facebookID(value: number) {
            this.person.facebookID = value;
        }
    }
}
