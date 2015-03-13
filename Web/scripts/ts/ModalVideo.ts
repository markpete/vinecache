/// <reference path="..\types\bootstrap\bootstrap.d.ts" />

module ModalVideo {

    class Dialog {
        private videoElement: HTMLVideoElement;
        private modalElement: HTMLDivElement;

        constructor() {
            this.initDialog();
        }
        private initDialog() {
            this.modalElement = createDiv("modal fade");
            this.modalElement.tabIndex = -1;
            this.modalElement.setAttribute("role", "dialog");

            var modalContent = createDiv("modal-content", null,
                createDiv("modal-dialog modal-lg", null, this.modalElement));

            var modalHeader = createDiv("modal-header", null, modalContent);
            addDialogCloseButton(modalHeader);

            var modalBody = createDiv("modal-body", null, modalContent);
            this.videoElement = document.createElement("video");
            this.videoElement.className = "img-responsive";
            this.videoElement.controls = true;
            modalBody.appendChild(this.videoElement);
        }

        show(url: string) {
            this.videoElement.src = url;
            $(this.modalElement).modal();
        }
    }

    function createDiv(className: string, id?: string, parent?:HTMLElement) {
        var div = document.createElement("div");
        div.className = className;
        if (id) { div.id = id; }
        if (parent) {
            parent.appendChild(div);
        }
        return div;
    }

    function addDialogCloseButton(parent: HTMLElement) {
        var button = document.createElement("button");
        button.className = "close";
        button.setAttribute("data-dismiss", "modal");
        button.setAttribute("aria-label", "Close");

        var span = document.createElement("span");
        span.innerHTML = "&times;";
        span.setAttribute("aria-hidden", "true");
        button.appendChild(span);

        parent.appendChild(button);
    }

    export var Instance = new Dialog();
}