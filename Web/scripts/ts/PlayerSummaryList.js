/// <reference path="../types/parse/parse.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PlayerSummaryList;
(function (PlayerSummaryList) {
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
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            this._eventHelper = new EventHelper.EventHelper(eventName);
        }
        PlayerSummaryProvider.prototype.addItems = function (list) {
            var _this = this;
            this._eventHelper.getPlayerData().then(function (players) {
                players.forEach(function (player) {
                    list.appendChild(_this.buildItem(player));
                });
            });
        };
        PlayerSummaryProvider.prototype.buildItem = function (player) {
            var _this = this;
            var item = document.createElement("li");
            item.className = "list-group-item";
            item.innerText = player.name;
            var videosSection = document.createElement("div");
            videosSection.id = "videos_" + player.id;
            videosSection.className = "collapse";
            var videosRow = document.createElement("div");
            videosRow.className = "row";
            player.videos.forEach(function (value) {
                _this.insertVideo(videosRow, value);
            });
            videosSection.appendChild(videosRow);
            var collapseButton = document.createElement("button");
            collapseButton.type = "button";
            collapseButton.className = "btn btn-primary";
            collapseButton.setAttribute("data-toggle", "collapse");
            collapseButton.setAttribute("data-target", "#" + videosSection.id);
            collapseButton.setAttribute("aria-expanded", "false");
            collapseButton.setAttribute("aria-controls", videosSection.id);
            collapseButton.style.cssFloat = "right";
            collapseButton.innerText = "Videos...";
            var badge = document.createElement("span");
            badge.className = "badge";
            badge.innerText = player.score.toString();
            item.appendChild(collapseButton);
            item.appendChild(badge);
            item.appendChild(videosSection);
            return item;
        };
        PlayerSummaryProvider.prototype.insertVideo = function (row, video) {
            var videoCol = document.createElement("div");
            videoCol.className = "col-xs-6 col-md-3";
            var thumbnail = document.createElement("div");
            thumbnail.className = "thumbnail";
            var videoElement = document.createElement("video");
            videoElement.src = video.url;
            videoElement.className = "img-responsive";
            thumbnail.appendChild(videoElement);
            videoCol.appendChild(thumbnail);
            row.appendChild(videoCol);
        };
        return PlayerSummaryProvider;
    })();
    PlayerSummaryList.PlayerSummaryListBuilder = new AutoRefreshListBuilder(new PlayerSummaryProvider("Microsoft Hunt"));
})(PlayerSummaryList || (PlayerSummaryList = {}));
