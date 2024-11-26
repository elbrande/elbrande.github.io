function getStyle(url) {
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = url;
    return style;
}
let n = window.open();
let script = document.createElement("script");
script.type = "module";
script.src = "https://js.arcgis.com/calcite-components/2.13.2/calcite.esm.js";
n.document.head.appendChild(script);

n.document.head.appendChild(getStyle("https://js.arcgis.com/calcite-components/2.13.2/calcite.css"));
n.document.head.appendChild(getStyle("https://js.arcgis.com/4.31/esri/themes/dark/main.css"));

let title = document.createElement("title");
title.textContent = "Map Report";
n.document.head.appendChild(title);
let dialog = bbbMap.summaryReportModal.cloneNode(true);
let div = document.createElement("div");
div.innerHTML = dialog.innerHTML;

n.document.body.appendChild(div);
