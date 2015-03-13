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
        private _eventHelper: EventHelper.EventHelper;

        constructor(eventName: string) {
            Parse.initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "H9tKhwb9aVps6QOxRYiG8NHEpXZdHK8Qlk6W8nF5");
            this._eventHelper = new EventHelper.EventHelper(eventName);
        }

        addItems(list: HTMLUListElement) {
            this._eventHelper.getPlayerData().then((players: EventHelper.Player[]) => {
                players.forEach((player: EventHelper.Player) => { list.appendChild(this.buildItem(player)); });
            });
        }

        private buildItem(player: EventHelper.Player) {
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

        private insertVideo(row: HTMLDivElement, video: EventHelper.Video) {
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

    export var PlayerSummaryListBuilder = new AutoRefreshListBuilder(new PlayerSummaryProvider("Microsoft Hunt"));
}
