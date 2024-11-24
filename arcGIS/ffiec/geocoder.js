const bbbMap = {};

bbbMap.init = () => {
    console.log("bbbMap.init");
    bbbMap.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";
    //bbbMap.censusTractService = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Median_Income_by_Race_and_Age_Selp_Emp_Boundaries/FeatureServer/2";
    bbbMap.censusTractService = "https://services.arcgis.com/XG15cJAlne2vxtgt/ArcGIS/rest/services/National_Risk_Index_Census_Tracts/FeatureServer/0";
    bbbMap.goToOptions = { animate: true, animationMode: "auto", duration: 1000, maxDuration: 2000, easing: "ease" };
    bbbMap.initMap();
};

bbbMap.initMap = () => {
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/FeatureTable", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/LayerList", "esri/widgets/Legend", "esri/widgets/Print", "esri/widgets/Search", "esri/core/reactiveUtils", "esri/geometry/geometryEngine", "esri/geometry/support/webMercatorUtils", "esri/geometry/Point", "esri/widgets/Sketch", "esri/smartMapping/renderers/color", "esri/PopupTemplate"], (esriConfig, Map, MapView, FeatureLayer, FeatureTable, GraphicsLayer, Graphic, BasemapGallery, LayerList, Legend, Print, Search, reactiveUtils, geometryEngine, webMercatorUtils, Point, Sketch, colorRendererCreator, PopupTemplate) =>
        (async () => {
            esriConfig.apiKey = bbbMap.apiKey;

            bbbMap.esri = {};
            bbbMap.esri.geometryEngine = geometryEngine;
            bbbMap.esri.reactiveUtils = reactiveUtils;
            bbbMap.esri.webMercatorUtils = webMercatorUtils;
            bbbMap.esri.FeatureLayer = FeatureLayer;
            bbbMap.esri.FeatureTable = FeatureTable;
            bbbMap.esri.Graphic = Graphic;
            bbbMap.esri.Point = Point;
            bbbMap.esri.Sketch = Sketch;
            bbbMap.esri.colorRendererCreator = colorRendererCreator;
            bbbMap.esri.PopupTemplate = PopupTemplate;

            console.log("Building Map");

            bbbMap.map = new Map({ basemap: "arcgis-dark-gray" });

            bbbMap.view = new MapView({
                map: bbbMap.map,
                //center: [-96.3537, 40.6698],
                center: [-80.54993452144528, 25.26285858333048],
                //zoom: 4,
                zoom: 9,
                highlightOptions: {
                    color: [255, 255, 0, 0],
                    haloColor: "#ffff00",
                    haloOpacity: 0.5,
                    fillOpacity: 0,
                },
                popupEnabled: true,
                popup: {
                    viewModel: { includeDefaultActions: 0 },
                    defaultPopupTemplateEnabled: 1,
                    actions: [
                        { title: "Nearby Tracts", id: "find-nearby-tracts", icon: "polygon" },
                        { title: "Refresh Census Demographics", id: "refresh-tract-info", icon: "information" },
                        //{ title: "Summarize Area", id: "get-summary-report", icon: "file-report" },
                    ],
                    dockEnabled: 1,
                    dockOptions: {
                        buttonEnabled: 0,
                        breakpoint: 0,
                    },
                },
                container: "map",
            });

            bbbMap.legendContainer = document.createElement("div");
            bbbMap.legendWidget = new Legend({ view: bbbMap.view, container: bbbMap.legendContainer });

            console.log("graphics layer");
            bbbMap.graphicsLayer = new GraphicsLayer({ id: "graphicsLayer", popupEnabled: 1, title: "Graphics" });
            bbbMap.map.add(bbbMap.graphicsLayer);

            console.log("referencing shape service, but not adding to map");
            bbbMap.censusTractShapeLayer = new FeatureLayer({ id: "censusTractService", url: bbbMap.censusTractService });
            //bbbMap.map.add(bbbMap.censusTractShapeLayer);

            bbbMap.view.on("immediate-click", async (e) => {
                console.log("Map click", e);
                if (e.button === 2) {
                    bbbMap.point = e.mapPoint;
                    bbbMap.view.openPopup({
                        title: "User Selection",
                        content: `Clicked ${e.mapPoint.latitude}, ${e.mapPoint.longitude} refresh census demographics to analyze this point`,
                        location: e.mapPoint,
                    });
                }

                const response = await bbbMap.view.hitTest(e);
                const results = response.results.filter((result) => result.graphic && result.graphic.layer === bbbMap.tractShapeLayer);
                if (results.length > 0) {
                    console.log("you clicked on a tract shape", results[0].graphic);
                }
            });

            //filter featureTable by view extent
            reactiveUtils.when(
                () => bbbMap.view.stationary,
                () => {
                    console.log("View is stationary.  Filter featureTable by extent");
                },
                { initial: true }
            );

            //listen for popup clicks
            reactiveUtils.on(
                () => bbbMap.view.popup,
                "trigger-action",
                (e) => {
                    console.log("reactiveUtils.on listening for popup", e.action.id, e, bbbMap.view.popup.selectedFeature);
                    let feature = bbbMap.view.popup.selectedFeature;

                    if (e.action.id === "find-nearby-tracts") {
                        bbbMap.getNearbyTracts(feature);
                    }
                    if (e.action.id === "refresh-tract-info") {
                        bbbMap.refreshTractInfo(feature);
                    }
                    if (e.action.id === "get-summary-report") {
                        bbbMap.getSummaryReport();
                    }
                }
            );

            //popup feature changed
            reactiveUtils.when(
                () => bbbMap.view.popup.selectedFeature,
                (feature) => {
                    console.log("Popup feature change", feature);

                    //bbbMap.view.popup.actions = [];

                    //if (feature.geometry.type === 'point) {
                    //bbbMap.view.popup.actions.push({ title: "Nearby Branches", id: "find-nearby-branches", icon: "measure" });
                    //bbbMap.view.popup.actions.push({ title: "Nearby Census Tracts", id: "find-nearby-tracts", icon: "polygon-area" });
                    //bbbMap.view.popup.actions.push({ title: "Google Maps", id: "google-maps", icon: "pin-tear" });
                    //}
                }
            );

            //view is ready
            bbbMap.view.when((view) => {
                console.log("View is ready.  Setup UI and Sketch Tools", view);
                bbbMap.ui();
                bbbMap.view.popup.highlightEnabled = true;

                bbbMap.sketchLayer = new GraphicsLayer();
                bbbMap.map.add(bbbMap.sketchLayer);

                bbbMap.sketch = new Sketch({
                    layer: bbbMap.sketchLayer,
                    view: bbbMap.view,
                    creationMode: "update",
                    availableCreateTools: ["polygon", "rectangle", "circle"],
                    defaultCreateOptions: { mode: "hybrid" },
                    defaultUpdateOptions: { mode: "move" },
                    visibleElements: { settingsMenu: false, selectionTools: { "rectangle-selection": false, "lasso-selection": false } },
                });

                bbbMap.sketch.on("create", (e) => {
                    if (e.state === "start") {
                        bbbMap.sketchLayer.removeAll();
                    }

                    if (e.state === "complete") {
                        console.log("sketch finished", e);
                        bbbMap.finishSketch(e.graphic, e.tool);
                    }
                });

                bbbMap.sketch.on("update", (e) => {
                    if (e.toolEventInfo && e.toolEventInfo.type && ["rotate-stop", "move-stop", "reshape-stop", "scale-stop"].indexOf(e.toolEventInfo.type) > -1) {
                        console.log("sketch updated", e);
                        bbbMap.finishSketch(e.graphics[0], e.tool);
                    }
                });

                bbbMap.view.ui.add(bbbMap.sketch, "top-right");
            });

            bbbMap.view.on("layerview-destroy", (event) => {
                console.log("Layerview destroyed", event.layer.id);
            });
        })()); //end require
};

bbbMap.showAlertxx = function (type, title, msg) {
    console.log("showAlert", type, title, msg);
    const alert = document.getElementById(`${type}Alert`);
    const t = document.getElementById(`${type}Title`);
    const m = document.getElementById(`${type}Msg`);
    if (alert) {
        t.innerHTML = title;
        m.innerHTML = msg;

        alert.open = true;
    }
};

bbbMap.showAlert = function (type, title, msg, node) {
    console.log("showAlert", type, title, msg);
    const alert = document.getElementById(`alert`);
    const t = document.getElementById(`alertTitle`);
    const m = document.getElementById(`alertMsg`);

    if (alert) {
        t.innerHTML = title;
        m.innerHTML = msg;
        if (node) {
            alert.appendChild(node);
        }
        alert.kind = type;
        alert.open = true;
    }
};

bbbMap.finishSketch = function (graphic, tool) {
    console.log("finishSketch", graphic, tool);
    if (graphic && graphic.geometry) {
        let size = bbbMap.esri.geometryEngine.geodesicArea(graphic.geometry, "square-miles");
        if (size > bbbMap.MAX_AREA) {
            bbbMap.showAlert("danger", `Shape Error with ${tool}`, `Shape is over the ${bbbMap.MAX_AREA} square mile limit (area is ${bbbMap.Number.format(size)}).  Please try again.`);
        } else {
            bbbMap.showAlert("success", `Filtering with ${tool}`, `Looking for tracts in ${bbbMap.Number.format(size)} square miles.`);
            //const div = document.createElement("div");
            //div.innerHTML = `Looking for tracts in ${bbbMap.Number.format(size)} square mile ${tool}.`;
            //bbbMap.view.ui.add(div, "top-left");
            bbbMap.getNearbyTracts(graphic, tool);
        }
    }
};

bbbMap.getSum = function (attr) {
    let data = bbbMap?.tractShapeLayerSource?.source;
    let rtn = "";
    try {
        if (data) {
            rtn = data.reduce((sum, item) => sum + item.attributes[attr], 0);
        }
    } catch (e) {
        console.log("Error getting Sum", e, attr);
    }
    return rtn;
};

bbbMap.getAvg = function (attr) {
    let data = bbbMap?.tractShapeLayerSource?.source;
    let rtn = "";
    try {
        if (data) {
            rtn = data.reduce((sum, item) => sum + item.attributes[attr], 0) / data.length;
        }
    } catch (e) {
        console.log("Error getting Avg", e, attr);
    }
    return rtn;
};

bbbMap.getMin = function (attr) {
    let data = bbbMap?.tractShapeLayerSource?.source;
    let rtn = "";
    try {
        if (data) {
            rtn = data.reduce((min, item) => (item.attributes[attr] < min ? item.attributes[attr] : min), Infinity);
        }
    } catch (e) {
        console.log("Error getting Min", e);
    }
    return rtn;
};

bbbMap.getMax = function (attr) {
    let data = bbbMap?.tractShapeLayerSource?.source;
    let rtn = "";
    try {
        if (data) {
            rtn = data.reduce((max, item) => (item.attributes[attr] > max ? item.attributes[attr] : max), -Infinity);
        }
    } catch (e) {
        console.log("Error getting Max", e);
    }
    return rtn;
};

bbbMap.applyFxn = function (fxn, attr) {
    return fxn(attr);
};

bbbMap.buildSummaryReportContent = function (container) {
    //build report struture
    let summaryReport = [];
    ["eal", "nri", "sovi", "cr"].forEach((g) => {
        console.log("group", g);
        let category = bbbMap.climateCols[g];
        if (category) {
            let reportGroups = category.filter((t) => t?.report);
            console.log("report groups", reportGroups);
            reportGroups.forEach((rg) => {
                summaryReport.push(rg);
            });
        }
    });

    console.log("summaryReport", summaryReport);
    summaryReport.forEach((g, i) => {
        console.log("Report group", g);
        const block = document.createElement("calcite-block");
        block.heading = g?.reportName;
        let open = i === 0 ? true : false;
        block.open = true;
        block.collapsible = true;
        //block.style = "width: 30%";
        const table = bbbMap.getTable();
        table.layout = "fixed";

        g.report.forEach((e) => {
            //console.log("Report", e);
            let val = bbbMap.applyFxn(e.fxn, g.name);
            let title = e.title;
            //console.log("here we go", val, title);
            table.appendChild(bbbMap.addRow(title, bbbMap[g.type].format(val)));
        });
        block.appendChild(table);
        container.appendChild(block);
    });
};
bbbMap.buildSummaryReportCharts = function (attr, title = "Chart") {
    console.log("buildSummaryReportCharts");
    let data = bbbMap?.tractShapeLayerSource?.source;
    const block = document.createElement("calcite-block");
    block.heading = title;
    block.open = true;
    block.collapsible = true;

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "300px";

    const canvas = document.createElement("canvas");
    //canvas.width = "300";
    //canvas.height = "200";
    container.appendChild(canvas);
    block.appendChild(container);
    console.log("canvas", container, canvas);
    let chartData = data.map((d) => {
        return { label: d.attributes.TRACTFIPS, risk: d.attributes.RISK_SCORE, sovi: d.attributes.SOVI_SCORE, eal: d.attributes.EAL_SCORE };
    });

    chartData.sort((a, b) => b.risk - a.risk);

    //let labels = data.map((d) => d.attributes.TRACT);
    //let risk_score = data.map((d) => d.attributes.RISK_SCORE);

    new Chart(canvas, {
        type: "line",
        data: {
            labels: chartData.map((m) => m.label), //, "SOVI", "EAL", "RESL"],
            datasets: [
                {
                    label: "Risk",
                    data: chartData.map((m) => m.risk), //, data.attributes.EAL_SCORE, data.attributes.SOVI_SCORE, data.attributes.RESL_SCORE],
                },
                {
                    label: "Vulnerability",
                    data: chartData.map((m) => m.sovi), //, data.attributes.EAL_SCORE, data.attributes.SOVI_SCORE, data.attributes.RESL_SCORE],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins :{
                tooltip: {
                    enabled: true
                },
                legend: {
                    display: true
                }
            },
            onClick: (event, elements) => {
                console.log('click'. event, elements, chartData, this);

            }
        },
    });
    //}, 100);
    return block;
};

bbbMap.getSummaryReport = function () {
    console.log("getSummaryReport");
    const modal = document.createElement("calcite-dialog");
    const modalContent = document.createElement("div");
    modal.modal = true;
    modal.open = true;
    modal.heading = "Area Summary Report";
    modal.slot = "dialogs";
    modalContent.classList.add("searchCardContainer");
    //modal.scale = "l";
    modal.widthScale = "l";

    //let s = [{ name: "EAL_VALT", alias: "Total Estimated Loss", format: "USDollar" }];
    let data = bbbMap.tractShapeLayerSource.source;
    let tracts = data.length;
    let area = bbbMap.getSum("AREA");
    let counties = [...new Set(data.map((i) => `${i.attributes.COUNTY}, ${i.attributes.STATE}`))];
    let countyTxt = counties.join(", ");
    const headerDiv = document.createElement("div");
    headerDiv.innerHTML = `<h3>Tracts: ${bbbMap.Number.format(tracts)} <br>Counties: ${countyTxt}<BR>Area ${bbbMap.Number.format(area)} square miles</h3>`;
    modal.appendChild(headerDiv);

    bbbMap.buildSummaryReportContent(modalContent);
    modal.appendChild(modalContent);

    const riskChart = bbbMap.buildSummaryReportCharts("RISK_SCORE", "Risk Chart");
    modal.appendChild(riskChart);

    //const ealChart = bbbMap.buildSummaryReportCharts("EAL_VALT", "Expected Annual Loss Chart");
    //modal.appendChild(ealChart);

    document.querySelector("calcite-shell").appendChild(modal);
};

bbbMap.getCard = function (heading, msg) {
    const card = document.createElement("calcite-card");
    const div = document.createElement("div");
    const chipLabel = document.createElement("calcite-chip");
    const chip = document.createElement("calcite-chip");
    div.slot = "heading";
    div.innerHTML = heading;

    chipLabel.kind = "";
    chipLabel.innerHTML = heading;
    chipLabel.slot = "footer-start";

    chip.kind = "brand";
    chip.innerHTML = msg;
    chip.slot = "footer-start";

    //card.innerHTML = `${c}: ${bbbMap.Number.format(r)}`;
    //card.appendChild(div);
    card.appendChild(chipLabel);
    card.appendChild(chip);
    return card;
};

bbbMap.refreshTractInfo = function (feature) {
    console.log("refreshTractInfo", feature);
    let p;
    if (feature && feature.geometry) {
        if (feature.geometry.centroid) {
            p = { latitude: feature.geometry.centroid.latitude, longitude: feature.geometry.centroid.longitude, type: "point" };
        } else {
            p = { latitude: feature.geometry.latitude, longitude: feature.geometry.longitude, type: "point" };
        }
    } else {
        p = bbbMap.point;
    }

    bbbMap.getFFIEC(p, { matchedAddress: "Click" });
};
bbbMap.getNearbyTracts = async function (feature, tool) {
    console.log("getNearbyTracts", feature, tool);
    let point, geom;
    try {
        if (bbbMap?.tractShapeLayer) {
            bbbMap?.tractShapeLayer.destroy();
        }

        if (tool) {
            geom = feature.geometry;
        } else {
            point = feature ? feature.geometry : bbbMap?.point;
            geom = bbbMap.esri.geometryEngine.geodesicBuffer(point, bbbMap.BUFFER_SIZE, "miles");
        }

        if (bbbMap.bufferGraphic) {
            bbbMap.graphicsLayer.remove(bbbMap.bufferGraphic);
        }
        bbbMap.bufferGraphic = new bbbMap.esri.Graphic({ geometry: geom, symbol: bbbMap.bufferedSymbol });
        bbbMap.graphicsLayer.add(bbbMap.bufferGraphic);

        const q = {
            where: "1=1",
            outFields: ["*"],
            geometry: geom,
            spatialRelationship: "intersects",
            returnGeometry: true,
            returnCentroid: true,
        };

        console.log("getNearbyTracts Query", q);
        const results = await bbbMap.censusTractShapeLayer.queryFeatures(q);
        //const results = await bbbMap.tractLayerView.queryFeatures(q);

        console.log("getNearbyTracts results", results);
        if (results.features.length === 0) {
            throw new Error("Unable to find a census tract for this location");
        }

        let layer = {
            id: "tractShapes",
            title: "Census Tract Shapes",
            opacity: 0.75,
            outFields: ["*"],
            popupEnabled: 1,
            popupTemplate: bbbMap.getPopupTemplate(),
            //renderer: { type: "simple", symbol: { type: "simple-fill", color: [183, 172, 131, 0.5], outline: { color: [255, 255, 255, 0.75], width: 0.1 } } },
            renderer: bbbMap.getClimateRenderer(bbbMap.focusArea),
            legendEnabled: 1,
            visible: 1,
            /*labelingInfo: [
                {
                    labelExpression: `[NAME]`, //$feature.NAME"], labelExpression
                    symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: [255, 255, 255, 0.9],
                        haloSize: 0.0,
                        haloColor: "white",
                        font: { size: 9 },
                    },
                    deconflictionStrategy: "none",
                },
            ],
            */
            fields: results.fields,
            source: results.features,
        };

        bbbMap.tractShapeLayerSource = layer;
        console.log("Creating client side feature layer", results.features, layer);

        bbbMap.tractShapeLayer = new bbbMap.esri.FeatureLayer(layer);
        /*
        const response = await bbbMap.esri.colorRendererCreator.createContinuousRenderer({
            layer: bbbMap.tractShapeLayer,
            field: "RISK_SCORE",
            view: bbbMap.view,
            baseMape: bbbMap.map.basemap,
            theme: "above-and-below",
            outlineOptimizationEnabled: true,
        });

        bbbMap.tractShapeLayer.renderer = response.renderer;

        */
        bbbMap.tractShapeLayerView = await bbbMap.map.add(bbbMap.tractShapeLayer);

        bbbMap.tractShapeLayer.queryExtent().then((response) => {
            bbbMap.view.goTo(response.extent.expand(1.2), bbbMap.goToOptions);
        });

        bbbMap.view.ui.add(bbbMap.legendContainer, "bottom-right");

        //bbbMap.view.ui.add()

        if (bbbMap.view.popup && bbbMap.view.popup.visible) {
            bbbMap.view.popup.close();
        }

        //if (!tool) {
        const area = bbbMap.esri.geometryEngine.geodesicArea(geom, "square-miles");
        //<calcite-action id="action-with-tooltip" text="Layers" icon="layers" text-enabled></calcite-action>
        let btn = "";
        if (!document.getElementById("summaryReportBtn")) {
            btn = document.createElement("calcite-button");
            //const btn = document.createElement("calcite-action");

            btn.innerHTML = "Summary Report";
            //btn.text = "Generate Summary Report";
            btn.slot = "actions-end";
            btn.iconStart = "file-report";
            btn.round = false;
            btn.id = "summaryReportBtn";

            btn.scale = "l";
            //btn.textEnabled = true;
            btn.addEventListener("click", (e) => {
                console.log("Report Button Click", e);
                bbbMap.getSummaryReport();
            });
        }
        bbbMap.showAlert("success", `Success`, `Found ${results.features.length} tracts within a ${bbbMap.BUFFER_SIZE} mile radius (${bbbMap.Number.format(area)} square miles).<br>`, btn);
        //}
    } catch (e) {
        bbbMap.showAlert("danger", `Error Getting Tracts`, `${e.message}`);
    }
};

bbbMap.getDictionary = function (area = bbbMap.focusArea) {
    let d = bbbMap.climateDictionary.find((d) => d.name === area);
    return d;
};

bbbMap.getClimateRenderer = function (area = "RISK") {
    //{ type: "simple-fill", color: [183, 172, 131, 0.5], outline: { color: [255, 255, 255, 0.75], width: 0.1 } } },
    let dict = bbbMap.getDictionary(area);
    //let field = dict.legendField;
    let field = `${area}_${dict.suffix}`;
    let outline = { color: [255, 255, 255, 0.75], width: 0.5 };
    let renderer = "";
    console.log("getClimateRenderer", area, field, dict);
    if (field) {
        renderer = {
            type: "unique-value",
            field: field,
            // defaultSymbol: { type: "simple-fill" },
            uniqueValueInfos: [
                { value: "Very High", symbol: { type: "simple-fill", color: [199, 68, 93, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Very High" },
                { value: "Relatively High", symbol: { type: "simple-fill", color: [224, 112, 105, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Relatively High" },
                { value: "Relatively Moderate", symbol: { type: "simple-fill", color: [240, 213, 93, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Relatively Moderate" },
                { value: "Relatively Low", symbol: { type: "simple-fill", color: [80, 155, 199, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Relatively Low" },
                { value: "Very Low", symbol: { type: "simple-fill", color: [77, 109, 189, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Very Low" },
                { value: "Insufficient Data", symbol: { type: "simple-fill", color: [158, 158, 158, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Insufficient Data" },
                { value: "Not Applicable", symbol: { type: "simple-fill", color: [158, 158, 158, 0.1], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Not Applicable" },
                { value: "No Rating", symbol: { type: "simple-fill", color: [158, 158, 158, 0.1], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "No Rating" },
            ],
        };
    }
    return renderer;
};

bbbMap.ui = function () {
    bbbMap.parameters = document.getElementById("parameters");
    bbbMap.mainPanel = document.getElementById("mainPanel");
    bbbMap.mainPanelContent = document.getElementById("mainPanelContent");
    bbbMap.parameters.style = "display: flex";

    bbbMap.view.ui.add(bbbMap.parameters, "top-right");

    const goBtn = document.getElementById("getGeocodeBtn");
    const address = document.getElementById("address");
    goBtn?.addEventListener("click", async (e) => {
        console.log("goBtn", e, address);
        bbbMap.census.geocoder(address.value);
    });

    let select = document.createElement("calcite-select");
    bbbMap.climateDictionary.forEach((c) => {
        let option = document.createElement("calcite-option");
        option.value = c.name;
        option.innerHTML = c.alias;
        select.appendChild(option);
    });

    let label = document.createElement("calcite-label");
    label.innerHTML = "Climate Risk Area";
    label.layout = "inline";
    label.appendChild(select);

    select.addEventListener("calciteSelectChange", (e) => {
        console.log("climate hazard change", e);
        bbbMap.focusArea = e.target.value;
        let renderer = bbbMap.getClimateRenderer(bbbMap.focusArea);
        let layer = bbbMap.map.findLayerById("tractShapes");
        if (layer && renderer) {
            layer.renderer = renderer;
            layer.popupTemplate = bbbMap.updatePopupTemplate();
        }
    });

    bbbMap.parameters.prepend(label);
};

bbbMap.getPopupTemplate = function () {
    //let a = bbbMap.climateDictionary.find((c) => c.name === bbbMap.focusArea);
    let a = bbbMap.getDictionary();
    const template = {
        title: `${a.alias} for Tract: {TRACT}`,
        content: bbbMap.getPopupContent,
    };
    return template;
};

bbbMap.updatePopupTemplate = function (feature = bbbMap.feature) {
    if (feature) {
        let a = bbbMap.getDictionary();
        console.log("updatePopupTemplate", a, feature);
        const template = {
            title: `${a.alias} for Tract: {TRACT}`,
            content: bbbMap.getPopupContent(feature),
        };
        return template;
    }
};

bbbMap.getPopupContent = function (feature) {
    console.log("getPopupContent", feature);
    let content = "",
        dict,
        cols;
    if (feature) {
        bbbMap.feature = feature;
    }

    const attributes = bbbMap.feature.graphic.attributes;
    dict = bbbMap.getDictionary(bbbMap.focusArea);
    console.log("dictionary found", dict);
    if (dict) {
        //cols = dict.cols;
        cols = bbbMap.climateCols[dict.type];
        console.log("cols found", cols);
        if (dict.type === "hazard") {
            cols = cols.map((c) => {
                return { name: `${bbbMap.focusArea}_${c.name}`, type: c.type, alias: c.alias, category: c.category };
            });
        }

        allCols = [...cols, ...bbbMap.climateCols.common];
        let groups = [...new Set(allCols.map((i) => i.category))];
        console.log("all cols", allCols, groups);

        let val;

        let status = attributes[`${bbbMap.focusArea}_${dict.suffix}`];
        content += `<div><h2>Risk: ${status} </h2>  </div>`;
        content += `<calcite-accordion selection-mode="single">`;
        groups.forEach((g, i) => {
            console.log("group", g, i);
            let columnGroup = allCols.filter((cols) => cols.category === g);
            console.log(columnGroup);

            //content += `<calcite-block open heading="${g}" collapsible><calcite-table scale="s">`;
            let expanded = i === 0 ? "expanded" : "";
            content += `<calcite-accordion-item ${expanded} heading="${g}" icon-start="data"><calcite-table scale="s" bordered>`;

            //allCols.forEach((col) => {
            columnGroup.forEach((col) => {
                //console.log("columns", col);
                val = attributes[col.name];
                if (val && !isNaN(val) && (col.type === "Number" || col.type === "USDollar")) {
                    val = bbbMap[col.type].format(val);
                }
                content += `<calcite-table-row><calcite-table-cell><strong>${col.alias}: </strong></calcite-table-cell><calcite-table-cell>${val}</calcite-table-cell></calcite-table-row>`;
            });
            //content += "</calcite-table></calcite-accordion>";
            content += "</calcite-table></calcite-accordion-item>";
        });
        content += "</calcite-accordion>";

        //////////
    }

    let div = document.createElement("div");
    div.innerHTML = content;

    return div;
};

bbbMap.clearMainPanel = function () {
    while (bbbMap.mainPanel.hasChildNodes()) {
        bbbMap.mainPanel.removeChild(bbbMap.mainPanel.firstChild);
    }
};

bbbMap.getFFIEC = async function (point, census) {
    console.log("getFFIEC", point, census);
    bbbMap.mainPanel.closed = false;
    bbbMap.clearMainPanel();
    const tract = await fetch(`https://geomap.ffiec.gov/ffiecgeomapwebapi/GetGeocodecensus?longitude=${point.longitude}&latitude=${point.latitude}&year=2024`);
    const result = await tract.json();
    console.log("Result", result);

    if (result) {
        const ffiecCensus = await fetch(`https://geomap.ffiec.gov/ffiecgeomapwebapi/GetCensusData?msacode=${result.MSACode}&statecode=${result.StateCode}&countycode=${result.CountyCode}&tractcode=${result.TractCode}&censusyear=2024`);
        const ffiecResults = await ffiecCensus.json();

        if (ffiecResults) {
            console.log("ffiecResult", ffiecResults);
            bbbMap.doMap(point, ffiecResults, census);

            const block = document.createElement("calcite-block");
            block.heading = "FFIEC Information";
            block.collapsible = true;
            block.open = true;

            //const ffiecContent = document.createElement("div");
            //ffiecContent.innerHTML = `Tract: ${result.TractCode}<br>            MSA: ${result.MSACode}<br>            State: ${result.StateCode}<br>            County: ${result.CountyCode}            `;
            const table = bbbMap.getTable();
            table.appendChild(bbbMap.addRow("Tract", result.TractCode));
            table.appendChild(bbbMap.addRow("County", `${result.CountyName} (${result.CountyCode})`));
            table.appendChild(bbbMap.addRow("MSA", `${result.MSAName} (${result.MSACode})`));
            table.appendChild(bbbMap.addRow("State", `${result.StateName} (${result.StateCode})`));

            bbbMap.mainPanel.appendChild(table);
            const tabs = bbbMap.getTabs(ffiecResults);
            const table2 = bbbMap.getTable();
            for (let key in ffiecResults) {
                if (ffiecResults.hasOwnProperty(key) && ffiecResults[key]) {
                    table2.appendChild(bbbMap.addRow(key, ffiecResults[key]));
                }
            }
            console.log("tabs", tabs);
            block.appendChild(tabs);
            bbbMap.mainPanel.appendChild(block);
        }
    }
};

bbbMap.doMap = function (point, ffiecResults, census) {
    console.log("doMap", point, ffiecResults, census);
    bbbMap.graphicsLayer.removeAll();
    let symbol = { type: "simple-marker", style: "circle", size: 10, color: [255, 125, 0, 0.75] };

    let tract;
    if (census?.geographies) {
        tract = census.geographies["Census Tracts"][0].NAME;
    } else {
        tract = "This tract";
    }
    let attributes = Object.assign({}, point, ffiecResults, { matchedAddress: census.matchedAddress });

    console.log("attributes", attributes);

    const popupTemplate = {
        title: "{matchedAddress}",
        //content: "This tract has a medium household income of {Decennial_Tract_MFI} or {MSA_MFI_pct} of the MSA making it an {Income_Indicator} income tract",
        content: `${tract} has a medium household income of ${bbbMap.USDollar.format(ffiecResults.Decennial_Tract_MFI)} or ${ffiecResults.MSA_MFI_pct}% of the MSA making it an ${ffiecResults.Income_Indicator} income tract`,
    };

    const graphic = new bbbMap.esri.Graphic({ geometry: point, attributes: attributes, popupTemplate: popupTemplate, symbol: symbol });
    bbbMap.graphicsLayer.add(graphic);
    let opt = { center: [point.longitude, point.latitude], zoom: 12 };
    bbbMap.view.goTo(opt, bbbMap.goToOptions);
};

bbbMap.getTabs = function (results) {
    console.log("getTabs", results);
    const tabs = document.createElement("calcite-tabs");
    tabs.layout = "inline";
    const nav = document.createElement("calcite-tab-nav");
    nav.slot = "title-group";

    bbbMap.ffiecDictionary.forEach((tab) => {
        const title = document.createElement("calcite-tab-title");
        title.innerHTML = tab.tabName;
        title.selected = tab.tabSelected;
        nav.appendChild(title);
    });

    tabs.appendChild(nav);

    bbbMap.ffiecDictionary.forEach((data) => {
        console.log(data.tabName, data.def.length);
        const tab = document.createElement("calcite-tab");
        tab.selected = data.tabSelected;

        const table = bbbMap.getTable();

        data.def.forEach((column) => {
            let val = results[column.name];
            if (column.format) {
                if (column.format === "boolean") {
                    val = parseInt(val, 10) === 1 ? "Yes" : "No";
                } else {
                    val = bbbMap[column.format].format(val);
                }
            }
            console.log("...Adding Tab", column.name, val);
            table.appendChild(bbbMap.addRow(column.alias, val));
        });
        console.log("...Tabs Added");
        tab.appendChild(table);
        tabs.appendChild(tab);
        console.log("...done");
    });

    /*
    const tabs = document.createElement("calcite-tabs");
    tabs.layout = "inline";

    const nav = document.createElement("calcite-tab-nav");
    nav.slot = "title-group";
    tabs.appendChild(nav);
    console.log("...Nav Added");

    bbbMap.ffiecDictionary.forEach((tab) => {
        const title = document.createElement("calcite-tab-title");
        title.innerHTML = tab.tabName;
        title.selected = tab.tabSelected;
        nav.appendChild(title);
    });

    console.log("...titles added");

    bbbMap.ffiecDictionary.forEach((data) => {
        console.log(data.tabName, data.def.length);
        const tab = document.createElement("calcite-tab");
        tab.selected = data.tabSelected;
        tabs.appendChild(tab);
        tab.innerHTML = "hi";
 //
        const table = bbbMap.getTable();

        data.def.forEach((column) => {
            let val = results[column.name];
            //if (column.format) {
            //val = bbbMap[column.format].format(val);
            //}
            console.log("...Adding Tab", column.name, val);
            table.appendChild(bbbMap.addRow(column.alias, val));
        });
        console.log("...Tabs Added");
        tab.appendChild(table);
        console.log("...done");
       
    });
    console.log("Tabs complete", tabs);
 */
    return tabs;
};

bbbMap.showCensusResult = function (result) {
    console.log("showCensusResult", result);
    if (result) {
        bbbMap.mainPanel.closed = false;
        bbbMap.mainPanel.innerHTML = "Address Found";

        let point = { latitude: result.coordinates.y, longitude: result.coordinates.x, type: "point" };
        bbbMap.getFFIEC(point, result);

        let tract = result.geographies["Census Tracts"][0];
        let state = result.geographies["States"][0];
        let csa = result.geographies["Combined Statistical Areas"][0];
        let county = result.geographies["Counties"][0];

        const block = document.createElement("calcite-block");
        block.heading = "Census Results";
        block.collapsible = true;
        block.open = false;

        const table = bbbMap.getTable();

        table.appendChild(bbbMap.addRow("Address", result.matchedAddress));
        table.appendChild(bbbMap.addRow("Latitude", result.coordinates.y));
        table.appendChild(bbbMap.addRow("Longitude", result.coordinates.x));

        table.appendChild(bbbMap.addRow("Tract GEOID", tract.GEOID));
        table.appendChild(bbbMap.addRow("Tract Name", tract.NAME));

        table.appendChild(bbbMap.addRow("County Code", county.COUNTY));
        table.appendChild(bbbMap.addRow("County Name", county.NAME));

        table.appendChild(bbbMap.addRow("State Code", state.STATE));
        table.appendChild(bbbMap.addRow("State Name", state.NAME));

        table.appendChild(bbbMap.addRow("CSA Code", csa.CSA));
        //table.appendChild(bbbMap.addRow("CSA Name", csa.NAME));

        block.appendChild(table);
        bbbMap.mainPanel.appendChild(block);
    } else {
        bbbMap.mainPanel.innerHTML = `Unable to find address.  Please try again.`;
    }
};

bbbMap.addRow = function (l, v) {
    const row = document.createElement("calcite-table-row");
    const label = document.createElement("calcite-table-cell");
    const value = document.createElement("calcite-table-cell");

    label.innerHTML = l;
    value.innerHTML = v;

    row.appendChild(label);
    row.appendChild(value);

    return row;
};
bbbMap.getTable = function () {
    const table = document.createElement("calcite-table");
    table.bordered = true;
    table.interactionMode = "static";
    table.layout = "auto";
    table.striped = true;
    table.scale = "s";
    return table;
};

bbbMap.census = {};

bbbMap.census.response = function (d) {
    console.log("Census Response", d);
    const result = d.result.addressMatches[0];
    bbbMap.census.result = result;
    console.log("Census Result", result);
    bbbMap.showCensusResult(result);
};

bbbMap.census.geocoder = function (address) {
    console.log("geocoder", address);
    bbbMap.mainPanel.closed = false;
    //bbbMap.clearMainPanel();
    bbbMap.mainPanel.innerHTML = "Getting lat/lng from Census Bureau";

    const s = document.createElement("script");
    const a = encodeURIComponent(address);
    const url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${a}&benchmark=Public_AR_Current&vintage=Current_Current&format=jsonp&callback=bbbMap.census.response`;
    //https://geocoding.geo.census.gov/geocoder/geographies/address?street=4600+Silver+Hill+Rd&city=Washington&state=DC&benchmark=Public_AR_Current&vintage=Current_Current&layers=10&format=json

    s.src = url;
    bbbMap.census.jsonp = s;
    document.body.appendChild(s);
};

bbbMap.ffiecDictionary = [
    {
        tabName: "Census",
        tabSelected: true,
        def: [
            { name: "Income_Indicator", alias: "Tract Income Level" },
            { name: "DistressedTractInd", alias: "Underserved or Distressed Tract" },
            { name: "HUD_est_MSA_MFI", alias: "2024 FFIEC Estimated MSA/MD/non-MSA/MD Median Family Income", format: "USDollar" },
            { name: "Est_Income", alias: "2024 Estimated Tract Median Family Income", format: "USDollar" },
            { name: "Decennial_Tract_MFI", alias: "2020 Tract Median Family Income", format: "USDollar" },
            { name: "MSA_MFI_pct", alias: "Tract Median Family Income %", format: "Number" },
            { name: "Population", alias: "Tract Population", format: "Number" },
            { name: "Minority_percentage", alias: "Tract Minority %", format: "Number" },
            { name: "Minority_Population", alias: "Tract Minority Population", format: "Number" },
            { name: "Owner_occupied_units", alias: "Owner-Occupied Units", format: "Number" },
            { name: "Num_1_to_4_units", alias: "1- to 4- Family Units", format: "Number" },
        ],
    },
    {
        tabName: "Income",
        tabSelected: false,
        def: [
            { name: "Income_Indicator", alias: "Tract Income Level" },
            { name: "Decennial_MSA_MFI", alias: "2020 MSA/MD/statewide non-MSA/MD Median Family Income", format: "USDollar" },
            { name: "HUD_est_MSA_MFI", alias: "2024 FFIEC Estimated MSA/MD/non-MSA/MD Median Family Income", format: "USDollar" },
            { name: "Poverty_level_percentage", alias: "% below Poverty Line", format: "Number" },
            { name: "MSA_MFI_pct", alias: "Tract Median Family Income %", format: "Number" },
            { name: "Decennial_Tract_MFI", alias: "2020 Tract Median Family Income", format: "USDollar" },
            { name: "Est_Income", alias: "2024 Estimated Tract Median Family Income", format: "USDollar" },
            { name: "Decennial_Tract_MHI", alias: "2020 Tract Median Household Income", format: "USDollar" },
        ],
    },
    {
        tabName: "Population",
        tabSelected: false,
        def: [
            { name: "Population", alias: "Tract Population", format: "Number" },
            { name: "Minority_percentage", alias: "Tract Minority %", format: "Number" },
            { name: "Family_count", alias: "Number of Families", format: "Number" },
            { name: "Total_housing_units", alias: "Number of Households", format: "Number" },
            { name: "Non_hispanic_white", alias: "Non-Hispanic White Population", format: "Number" },
            { name: "Minority_Population", alias: "Tract Minority Population", format: "Number" },
            { name: "Non_hispanic_american_indian", alias: "American Indian Population", format: "Number" },
            { name: "Non_hispanic_asian", alias: "Asian/Hawaiian/Pacific Islander Population", format: "Number" },
            { name: "Non_hispanic_black", alias: "Black Population", format: "Number" },
            { name: "Hispanics", alias: "Hispanic Population", format: "Number" },
            { name: "Non_hispanic_other", alias: "Other/Two or More Races Population", format: "Number" },
        ],
    },
    {
        tabName: "Housing",
        tabSelected: false,
        def: [
            { name: "Household_count", alias: "Total Housing Units", format: "Number" },
            { name: "Num_1_to_4_units", alias: "1- to 4- Family Units", format: "Number" },
            { name: "Median_unit_age", alias: "Median House Age (Years)", format: "Number" },
            { name: "Owner_occupied_units", alias: "Owner-Occupied Units", format: "Number" },
            { name: "Renter_occupied_units", alias: "Renter Occupied Units", format: "Number" },
            { name: "Own_occ_1_to_4_units", alias: "Owner Occupied 1- to 4- Family Units", format: "Number" },
            { name: "Central_City_Flag", alias: "Inside Principal City?", format: "boolean" },
            { name: "Units_vacant", alias: "Vacant Units", format: "Number" },
        ],
    },
];

bbbMap.bufferedSymbol = {
    type: "simple-fill",
    color: [255, 255, 0, 0.05],
    outline: {
        color: [255, 255, 0, 0.3],
        width: 0.5,
    },
};

bbbMap.Number = new Intl.NumberFormat("en-US");
bbbMap.USDollar = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0, style: "currency", currency: "USD" });

bbbMap.BUFFER_SIZE = 3;
bbbMap.MAX_AREA = 500;
bbbMap.focusArea = "RISK";

bbbMap.climateDictionary = [
    { name: "RISK", alias: "Composite Climate", type: "nri", suffix: "RATNG" },
    { name: "EAL", alias: "Expected Annual Loss", type: "eal", suffix: "RATNG" },
    { name: "SOVI", alias: "Social Vulnerability", type: "sovi", suffix: "RATNG" },
    { name: "RESL", alias: "Community Resilience", type: "cr", suffix: "RATNG" },
    { name: "AVLN", alias: "Avalanche", type: "hazard", suffix: "RISKR" },
    { name: "CFLD", alias: "Coastal Flooding", type: "hazard", suffix: "RISKR" },
    { name: "CWAV", alias: "Cold Wave", type: "hazard", suffix: "RISKR" },
    { name: "DRGT", alias: "Drought", type: "hazard", suffix: "RISKR" },
    { name: "ERQK", alias: "Earthquake", type: "hazard", suffix: "RISKR" },
    { name: "HAIL", alias: "Hail", type: "hazard", suffix: "RISKR" },
    { name: "HWAV", alias: "Heat Wave", type: "hazard", suffix: "RISKR" },
    { name: "HRCN", alias: "Hurricane", type: "hazard", suffix: "RISKR" },
    { name: "ISTM", alias: "Ice Storm", type: "hazard", suffix: "RISKR" },
    { name: "LNDS", alias: "Landslide", type: "hazard", suffix: "RISKR" },
    { name: "LTNG", alias: "Lightning", type: "hazard", suffix: "RISKR" },
    { name: "RFLD", alias: "Riverine Flooding", type: "hazard", suffix: "RISKR" },
    { name: "SWND", alias: "Strong Wind", type: "hazard", suffix: "RISKR" },
    { name: "TRND", alias: "Tornado", type: "hazard", suffix: "RISKR" },
    { name: "TSUN", alias: "Tsunami", type: "hazard", suffix: "RISKR" },
    { name: "VLCN", alias: "Volcanic Activity", type: "hazard", suffix: "RISKR" },
    { name: "WFIR", alias: "Wildfire", type: "hazard", suffix: "RISKR" },
    { name: "WNTW", alias: "Winter Weather", type: "hazard", suffix: "RISKR" },
];

bbbMap.climateCols = {
    common: [
        { name: "STATE", alias: "State", type: "string", category: "Tract" },
        { name: "COUNTY", alias: "County", type: "string", category: "Tract" },
        { name: "TRACT", alias: "Tract", type: "string", category: "Tract" },
        { name: "TRACTFIPS", alias: "GEOID", type: "string", category: "Tract" },
        { name: "POPULATION", alias: "Population", type: "Number", category: "Tract" },
        { name: "BUILDVALUE", alias: "Building", type: "USDollar", category: "Tract" },
        { name: "AGRIVALUE", alias: "Agriculture", type: "USDollar", category: "Tract" },
        { name: "NRI_VER", alias: "Version", type: "string", category: "Tract" },
    ],

    nri: [
        { name: "RISK_RATNG", alias: "Rating", type: "string", category: "NRI" },
        {
            name: "RISK_SCORE",
            alias: "Score",
            type: "Number",
            category: "NRI",
            reportName: "Risk Rating",
            report: [
                { title: "Avg Risk Score", fxn: bbbMap.getAvg },
                { title: "Min Risk Score", fxn: bbbMap.getMin },
                { title: "Max Risk Score", fxn: bbbMap.getMax },
            ],
        },
        { name: "RISK_SPCTL", alias: "State Percentile", type: "Number", category: "NRI" },
    ],
    eal: [
        { name: "EAL_RATNG", alias: "Rating", type: "string", category: "EAL" },
        {
            name: "EAL_VALT",
            alias: "Total Loss",
            type: "USDollar",
            category: "EAL",
            reportName: "Estimated Annual Loss Amount",
            report: [
                { title: "Total Estimated Loss", fxn: bbbMap.getSum },
                { title: "Avg Estimated Loss", fxn: bbbMap.getAvg },
                { title: "Max Estimated Loss", fxn: bbbMap.getMax },
            ],
        },
        {
            name: "EAL_SCORE",
            alias: "Score",
            type: "Number",
            category: "EAL",
            reportName: "Estimated Annual Loss Score",
            report: [
                { title: "Avg Score", fxn: bbbMap.getAvg },
                { title: "Min Score", fxn: bbbMap.getMin },
                { title: "Max Score", fxn: bbbMap.getMax },
            ],
        },

        { name: "EAL_SPCTL", alias: "State Percentile", type: "Number", category: "EAL" },
        { name: "ALR_NPCTL", alias: "National Percentile", type: "Number", category: "EAL" },
        { name: "EAL_VALB", alias: "Building Loss", type: "USDollar", category: "EAL" },
        //{ name: "ALR_VALB", alias: "Building Loss Rate", type: "USDollar", category: "EAL" },

        { name: "EAL_VALA", alias: "Agriculture Loss", type: "USDollar", category: "EAL" },
        // { name: "ALR_VALA", alias: "Agriculture Loss Rate", type: "USDollar", category: "EAL" },

        { name: "EAL_VALP", alias: "Population Loss", type: "USDollar", category: "EAL" },
        //{ name: "ALR_VALP", alias: "Population Loss Rate", type: "USDollar", category: "EAL" },
        // { name: "EAL_VALE", alias: "Population Equivalance Loss", type: "USDollar", category: "EAL" },

        { name: "ALR_VRA_NPCTL", alias: "Social Vulnerability and Community Resilience Rate", type: "Number", category: "EAL" },
    ],
    sovi: [
        { name: "SOVI_RATNG", alias: "Rating", type: "string", category: "SOVI" },
        {
            name: "SOVI_SCORE",
            alias: "Score",
            type: "Number",
            category: "SOVI",
            reportName: "Social Vulnerability",
            report: [
                { title: "Avg SOVI Score", fxn: bbbMap.getAvg },
                { title: "Min SOVI Score", fxn: bbbMap.getMin },
                { title: "Max SOVI Score", fxn: bbbMap.getMax },
            ],
        },
        { name: "SOVI_SPCTL", alias: "State Percentile", type: "Number", category: "SOVI" },
    ],
    cr: [
        { name: "RESL_RATNG", alias: "Rating", type: "string", category: "Resilience" },
        {
            name: "RESL_SCORE",
            alias: "Score",
            type: "Number",
            category: "Resilience",
            reportName: "Community Resilience Score",
            report: [
                { title: "Avg Resilience Score", fxn: bbbMap.getAvg },
                { title: "Min Resilience Score", fxn: bbbMap.getMin },
                { title: "Max Resilience Score", fxn: bbbMap.getMax },
            ],
        },
        { name: "RESL_SPCTL", alias: "State Percentile", type: "Number", category: "Resilience" },
    ],
    hazard: [
        { name: "RISKR", alias: "Rating", type: "string", category: "Summary" },
        //{ name: "RISKV", alias: "Hazard Type Risk Index Value", type: "double" },
        { name: "RISKS", alias: "Score", type: "Number", category: "Summary" },
        { name: "EVNTS", alias: "Number of Events", type: "Number", category: "Summary" },
        { name: "AFREQ", alias: "Frequency", type: "Number", category: "Summary" },

        { name: "EXP_AREA", alias: "Impacted Area (sq mi)", type: "Number", category: "Exposure" },
        { name: "EXPB", alias: "Building Value", type: "USDollar", category: "Exposure" },
        { name: "EXPP", alias: "Population", type: "Number", category: "Exposure" },
        { name: "EXPPE", alias: "Population Equivalence", type: "Number", category: "Exposure" },
        { name: "EXPA", alias: "Agriculture Value", type: "USDollar", category: "Exposure" },
        { name: "EXPT", alias: "Total", type: "Number", category: "Exposure" },

        { name: "HLRR", alias: "Total Rating", type: "string", category: "Historic Loss Ratio" },
        { name: "HLRB", alias: "Buildings", type: "Number", category: "Historic Loss Ratio" },
        { name: "HLRP", alias: "Population", type: "Number", category: "Historic Loss Ratio" },
        { name: "HLRA", alias: "Agriculture", type: "Number", category: "Historic Loss Ratio" },

        { name: "EALR", alias: "Rating", type: "string", category: "Expected Annual Loss" },
        { name: "EALS", alias: "Score", type: "Number", category: "Expected Annual Loss" },
        { name: "EALT", alias: "Total", type: "Number", category: "Expected Annual Loss" },
        { name: "ALR_NPCTL", alias: "National Percentile", type: "Number", category: "Expected Annual Loss" },
        { name: "EALB", alias: "Building Value", type: "USDollar", category: "Expected Annual Loss" },
        { name: "EALP", alias: "Population", type: "Number", category: "Expected Annual Loss" },
        { name: "EALPE", alias: "Population Equivalence", type: "Number", category: "Expected Annual Loss" },
        { name: "EALA", alias: "Agriculture Value", type: "USDollar", category: "Expected Annual Loss" },

        { name: "ALRB", alias: "Building Rate", type: "Number", category: "Expected Annual Loss" },
        { name: "ALRP", alias: "Population Rate", type: "Number", category: "Expected Annual Loss" },
        { name: "ALRA", alias: "Agriculture Rate", type: "Number", category: "Expected Annual Loss" },
    ],
};

/*
bbbMap.climateCategories.map((c) => {
    let cols = temp1.filter((t) => t.name.includes(`${c.name}_`));
    let m = cols.map((t) => {
        return { name: t.name, alias: t.alias, type: t.type };
    }); // {name: t.name, alias: t.alias, type: t.type});
    c["cols"] = m;
    return c;
});
*/
