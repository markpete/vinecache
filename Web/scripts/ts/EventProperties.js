/// <reference path="../types/parse/parse.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventProperties;
(function (EventProperties) {
    var AutoRefreshListBuilder = (function (_super) {
        __extends(AutoRefreshListBuilder, _super);
        function AutoRefreshListBuilder(ip, refreshRate) {
            if (refreshRate === void 0) { refreshRate = 30000; }
            _super.call(this, ip);
            this._refreshRate = refreshRate;
        }
        AutoRefreshListBuilder.prototype.buildList = function () {
            var list = _super.prototype.buildList.call(this);
            setInterval(this.refreshList.bind(this, list), this._refreshRate);
            return list;
        };
        AutoRefreshListBuilder.prototype.refreshList = function (list) {
            $(list).empty();
            this.itemProvider.addItems(list);
        };
        return AutoRefreshListBuilder;
    })(ListUtilities.ListBuilder);
    var PlayerSummaryProvider = (function () {
        function PlayerSummaryProvider(eventName) {
            this.EventObject = Parse.Object.extend("Event");
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            this._eventName = eventName;
        }
        Object.defineProperty(PlayerSummaryProvider.prototype, "event", {
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
        PlayerSummaryProvider.prototype.addItems = function (list) {
            var _this = this;
            this.getPlayerData().then(function (players) {
                players.forEach(function (player) {
                    list.appendChild(_this.buildItem(player));
                });
            });
        };
        PlayerSummaryProvider.prototype.getPlayerData = function () {
            var players = [];
            return this.event.then(function (value) {
                var query = value.relation("Players").query();
                query.descending("Score");
                return query.find();
            }).then(function (results) {
                var promises = [];
                results.forEach(function (result) {
                    var player = new Player(new Person(), result.get("Score"));
                    promises.push(result.relation("Person").query().find().then(function (results) {
                        if (results && results.length > 0) {
                            var person = results[0];
                            player.name = person.get("Name");
                        }
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
        PlayerSummaryProvider.prototype.buildItem = function (player) {
            var item = document.createElement("li");
            item.className = "list-group-item";
            item.innerText = player.name;
            var badge = document.createElement("span");
            badge.className = "badge";
            badge.innerText = player.score.toString();
            item.appendChild(badge);
            return item;
        };
        return PlayerSummaryProvider;
    })();
    var Person = (function () {
        function Person() {
        }
        return Person;
    })();
    var Player = (function () {
        function Player(person, score) {
            this.person = person;
            this.score = score;
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
        return Player;
    })();
    EventProperties.PlayerSummaryListBuilder = new AutoRefreshListBuilder(new PlayerSummaryProvider("Microsoft Hunt"));
})(EventProperties || (EventProperties = {}));
