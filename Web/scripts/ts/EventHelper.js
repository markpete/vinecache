/// <reference path="../types/parse/parse.d.ts" />
var EventHelper;
(function (_EventHelper) {
    var EventHelper = (function () {
        function EventHelper(eventName) {
            this.EventObject = Parse.Object.extend("Event");
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            this._eventName = eventName;
        }
        Object.defineProperty(EventHelper.prototype, "event", {
            get: function () {
                var _this = this;
                if (this._eventInitialized) {
                    return this._event.fetch();
                }
                else {
                    var query = new Parse.Query(this.EventObject);
                    query.equalTo("Name", this._eventName);
                    return query.find().then(function (results) {
                        if (results && results.length > 0) {
                            _this._event = results[0];
                            _this._eventInitialized = true;
                        }
                        return Parse.Promise.as(_this._event);
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        EventHelper.prototype.getPlayerData = function () {
            var players = [];
            return this.event.then(function (value) {
                var query = value.relation("Players").query();
                query.descending("Score");
                return query.find();
            }).then(function (results) {
                var promises = [];
                results.forEach(function (result) {
                    var player = new Player(new Person(), result.get("Score"), result.get("Coordinates"));
                    player.id = result.id;
                    promises.push(result.relation("Person").query().find().then(function (results) {
                        if (results && results.length > 0) {
                            var person = results[0];
                            player.name = person.get("Name");
                            player.email = person.get("Email");
                            player.facebookID = person.get("FacebookID");
                        }
                    }));
                    promises.push(result.relation("Videos").query().find().then(function (results) {
                        results.forEach(function (result) {
                            var video = new Video();
                            var file = result.get("Video");
                            video.url = file.url();
                            player.videos.push(video);
                        });
                    }));
                    players.push(player);
                });
                return Parse.Promise.when(promises);
            }).then(function () {
                return Parse.Promise.as(players);
            }, function (reason) {
                alert(reason.message);
                return Parse.Promise.error(reason);
            });
        };
        return EventHelper;
    })();
    _EventHelper.EventHelper = EventHelper;
    var Person = (function () {
        function Person() {
        }
        return Person;
    })();
    _EventHelper.Person = Person;
    var Video = (function () {
        function Video() {
        }
        return Video;
    })();
    _EventHelper.Video = Video;
    var Player = (function () {
        function Player(person, score, coordinates) {
            this.person = person;
            this.score = score;
            this.videos = [];
        }
        Object.defineProperty(Player.prototype, "name", {
            get: function () {
                return this.person.name;
            },
            set: function (value) {
                this.person.name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "email", {
            get: function () {
                return this.person.email;
            },
            set: function (value) {
                this.person.email = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "facebookID", {
            get: function () {
                return this.person.facebookID;
            },
            set: function (value) {
                this.person.facebookID = value;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    })();
    _EventHelper.Player = Player;
})(EventHelper || (EventHelper = {}));
