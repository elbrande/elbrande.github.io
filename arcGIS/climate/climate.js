const bbbMap = { version: "1.2.0" };
//https://www.arcgis.com/home/item.html?id=9da4eeb936544335a6db0cd7a8448a51
bbbMap.init = () => {
    console.log(`Climate Map Version: ${bbbMap.version}`);
    bbbMap.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";
    //bbbMap.censusTractService = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Median_Income_by_Race_and_Age_Selp_Emp_Boundaries/FeatureServer/2";
    bbbMap.nriTractService = "https://services.arcgis.com/XG15cJAlne2vxtgt/ArcGIS/rest/services/National_Risk_Index_Census_Tracts/FeatureServer/0";
    bbbMap.nriCountyService = "https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer";
    bbbMap.cbsaService = "https://services1.arcgis.com/HLC8bAygObK4fhPW/ArcGIS/rest/services/Core_based_statistical_area_for_the_US_July_2023/FeatureServer/2";
    bbbMap.tractService = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Poverty_by_Age_Boundaries/FeatureServer/2";
    bbbMap.goToOptions = { animate: true, animationMode: "auto", duration: 1000, maxDuration: 2000, easing: "ease" };
    bbbMap.initMap();
};

bbbMap.initMap = () => {
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/FeatureTable", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/LayerList", "esri/widgets/Legend", "esri/widgets/Print", "esri/widgets/Search", "esri/core/reactiveUtils", "esri/geometry/geometryEngine", "esri/geometry/support/webMercatorUtils", "esri/geometry/Point", "esri/widgets/Sketch", "esri/smartMapping/renderers/color", "esri/PopupTemplate", "esri/geometry/operators/labelPointOperator", "esri/widgets/HistogramRangeSlider", "esri/smartMapping/statistics/histogram", "esri/smartMapping/statistics/summaryStatistics", "esri/widgets/Expand"], (esriConfig, Map, MapView, FeatureLayer, FeatureTable, GraphicsLayer, Graphic, BasemapGallery, LayerList, Legend, Print, Search, reactiveUtils, geometryEngine, webMercatorUtils, Point, Sketch, colorRendererCreator, PopupTemplate, labelPointOperator, HistogramRangeSlider, histogram, summaryStatistics, Expand) =>
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
            bbbMap.esri.labelPointOperator = labelPointOperator;
            bbbMap.esri.HistogramRangeSlider = HistogramRangeSlider;
            bbbMap.esri.histogram = histogram;
            bbbMap.esri.summaryStatistics = summaryStatistics;
            bbbMap.esri.Expand = Expand;

            console.log("Building Map");

            bbbMap.map = new Map({ basemap: "arcgis-dark-gray" });

            bbbMap.view = new MapView({
                map: bbbMap.map,
                //center: [-96.3537, 40.6698],
                center: [-80.20523847652363, 25.780259479100824],
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
                        { title: "ATM", id: "find-nearby-atm", icon: "credits" },
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

            bbbMap.view.ui.components = ["attribution"];

            bbbMap.legendContainer = document.createElement("div");
            bbbMap.legendWidget = new Legend({ view: bbbMap.view, container: bbbMap.legendContainer });

            console.log("graphics layer");
            bbbMap.graphicsLayer = new GraphicsLayer({ id: "graphicsLayer", popupEnabled: 1, title: "Graphics" });
            bbbMap.map.add(bbbMap.graphicsLayer);

            console.log("referencing shape service, but not adding to map");
            bbbMap.nriTractShapeLayer = new FeatureLayer({ id: "nriTractService", url: bbbMap.nriTractService });
            bbbMap.nriCountyShapeLayer = new FeatureLayer({ id: "nriCountyService", url: bbbMap.nriCountyService });
            bbbMap.cbsaShapeLayer = new FeatureLayer({ id: "cbsaService", url: bbbMap.cbsaService });
            bbbMap.tractLayer = new FeatureLayer({ id: "tractService", url: bbbMap.tractService });
            //bbbMap.map.add(bbbMap.nriTractShapeLayer);

            bbbMap.view.on("immediate-click", async (e) => {
                console.log("Map click", e);
                if (e.button === 2) {
                    bbbMap.point = e.mapPoint;
                    bbbMap.view.openPopup({
                        title: "User Selection",
                        content: `Clicked ${e.mapPoint.longitude}, ${e.mapPoint.latitude} refresh census demographics to analyze this point`,
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
                    if (e.action.id === "find-nearby-atm") {
                        bbbMap.getNearbyATM(feature);
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
                    //bbbMap.updatePopupTemplate(feature);

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

bbbMap.showAlert = function (type, title, msg, node) {
    console.log("showAlert", type, title, msg);
    const alert = document.getElementById(`alert`);
    const t = document.getElementById(`alertTitle`);
    const m = document.getElementById(`alertMsg`);
    let btn = document.getElementById("summaryReportBtn");
    let resetBtn = document.getElementById("summaryReportResetBtn");

    if (btn) {
        alert.removeChild(btn);
    }
    if (resetBtn) {
        alert.removeChild(resetBtn);
    }

    if (alert) {
        t.innerHTML = title;
        m.innerHTML = msg;
        if (node) {
            node.forEach((n) => alert.appendChild(n));
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

bbbMap.getBlock = function (title = "", collapsible = true, open = true) {
    const block = document.createElement("calcite-block");
    block.heading = title;
    block.open = open;
    block.collapsible = collapsible;
    return block;
};

bbbMap.getTractGeom = async function (geoid) {
    const q = {
        where: `TRACTFIPS = '${geoid}'`,
        outFields: ["*"],
        returnGeometry: true,
        returnCentroid: true,
    };

    console.log("getTractGeom Query", q);
    const results = await bbbMap.tractShapeLayer.queryFeatures(q);
    //const results = await bbbMap.tractLayerView.queryFeatures(q);

    console.log("getTractGeom results", results);
    return results;
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

bbbMap.getATMContent = function (feature) {
    console.log("getATMContent", feature);
    rtn = ``;
    //let obj = feature.graphic.attributes;
    let obj = JSON.parse(feature.graphic.attributes.tags);

    const table = bbbMap.getTable();

    for (const key in obj) {
        console.log("key", key);
        if (obj.hasOwnProperty(key)) {
            table.appendChild(bbbMap.addRow(key, obj[key]));
            //rtn += `${key}: ${obj[key]}<br>`;
        }
    }
    const div = document.createElement("div");
    div.appendChild(table);
    return div;
};

bbbMap.getATMTemplate = function () {
    //let a = bbbMap.climateDictionary.find((c) => c.name === bbbMap.focusArea);

    const template = {
        title: `ATM`,
        content: bbbMap.getATMContent,
    };
    return template;
};

bbbMap.getNearbyATM = async (feature, d = 1.2) => {
    console.log("getNearbyATM", feature, d);
    try {
        point = feature ? feature.geometry : bbbMap?.point;
        console.log("point", point);
        const url = "https://overpass-api.de/api/interpreter";

        // Define the Overpass QL query
        const q = `
        [out:json];
        (
          node["amenity"="atm"](around:2000,${point.latitude},${point.longitude});
        );
        out body;
        `;

        // Function to fetch ATM locations

        // Send the query to the Overpass API
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ data: q }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        console.log("ATM data", data);
        // Extract and log ATM locations
        if (data.elements && data.elements.length > 0) {
            //let fields = [];
            const features = data.elements.map((e) => {
                let attr = { id: e.id, tags: JSON.stringify(e.tags) };

                return { geometry: { type: "point", latitude: e.lat, longitude: e.lon }, attributes: attr, popupTemplate: { title: "ATM", content: "hi" } };
            });
            data.elements.forEach((element) => {
                console.log(element);
                const { lat, lon } = element;
                console.log(`ATM found at Latitude: ${lat}, Longitude: ${lon}`);
            });

            //

            let layer = {
                id: "atmLayer",
                title: "Nearby ATMs",
                opacity: 0.75,
                outFields: ["*"],
                popupEnabled: 1,
                popupTemplate: bbbMap.getATMTemplate(),
                renderer: { type: "simple", symbol: { type: "simple-marker", size: 8, color: [56, 182, 255, 0.55], outline: { width: 0, color: "white" } } },
                legendEnabled: 1,
                visible: 1,
                fields: [
                    { name: "id", alias: "ID", type: "oid" },
                    { name: "tags", alias: "Tags", type: "string" },
                ],
                source: features,
            };

            bbbMap.atmLayerSource = layer;
            console.log("Creating client side ATM feature layer", features, layer);

            bbbMap.atmLayer = new bbbMap.esri.FeatureLayer(layer);
            bbbMap.map.add(bbbMap.atmLayer);
            bbbMap.atmLayerView = await bbbMap.view.whenLayerView(bbbMap.atmLayer);

            bbbMap.atmLayer.queryExtent().then((response) => {
                bbbMap.view.goTo(response.extent.expand(1.2), bbbMap.goToOptions);
            });
        } else {
            console.log("No ATMs found in the specified area.");
        }
    } catch (e) {
        console.log("Error getting ATMs", e);
    }
};

bbbMap.getNearbyATMxx = async (feature, d = 1.2) => {
    console.log("getNearbyATM", feature, d);
    try {
        if (feature) {
            bbbMap.selectedFeature = feature;
        }
        const url = "https://overpass-api.de/api/interpreter";
        /*
        const q = `
        [out:json];
        (
            node["amenity"="atm"][around:500,${feature.geometry.latitude},${feature.geometry.longitude}]
        );
        out body;
        `;
*/
        const q = `
[out:json];
(
  node["amenity"="atm"](around:500,37.7749,-122.4194);
);
out body;
`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ data: q }),
        });
        console.log("ATM results", response);
        if (!response.ok) {
            throw new Error(`Error fetching ATM data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
            const { lat, lng } = element;
            console.log(`ATM found at ${lat}, ${lng}`);
        } else {
            console.log("No ATMS found");
        }
    } catch (e) {
        console.log("Error getting ATMs");
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
            legendOptions: { title: dict.alias },
            // defaultSymbol: { type: "simple-fill" },
            uniqueValueInfos: [
                { value: "Very High", symbol: { type: "simple-fill", color: [199, 68, 93, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } },
                { value: "Relatively High", symbol: { type: "simple-fill", color: [224, 112, 105, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } },
                { value: "Relatively Moderate", symbol: { type: "simple-fill", color: [240, 213, 93, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } },
                { value: "Relatively Low", symbol: { type: "simple-fill", color: [80, 155, 199, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } },
                { value: "Very Low", symbol: { type: "simple-fill", color: [77, 109, 189, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } },
                //{ value: "Insufficient Data", symbol: { type: "simple-fill", color: [158, 158, 158, 0.9], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Insufficient Data" },
                //{ value: "Not Applicable", symbol: { type: "simple-fill", color: [158, 158, 158, 0.1], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "Not Applicable" },
                //{ value: "No Rating", symbol: { type: "simple-fill", color: [158, 158, 158, 0.1], outline: { color: [255, 255, 255, 0.8], width: 0.5 } }, label: "No Rating" },
            ],
        };
        if (dict.type === "sovi" || dict.type === "resl") {
            renderer.uniqueValueInfos.push({ value: "Data Unavailable", symbol: { type: "simple-fill", color: [133, 133, 133, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
        } else if (dict.type === "nri") {
            renderer.uniqueValueInfos.push({ value: "Insufficient Data", symbol: { type: "simple-fill", color: [133, 133, 133, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
            renderer.uniqueValueInfos.push({ value: "No Rating", symbol: { type: "simple-fill", color: [255, 255, 255, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
        } else if (dict.type === "eal") {
            renderer.uniqueValueInfos.push({ value: "No Expected Annual Losses", symbol: { type: "simple-fill", color: [255, 255, 255, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
        } else if (dict.type === "hazard") {
            renderer.uniqueValueInfos.push({ value: "Insufficient Data", symbol: { type: "simple-fill", color: [133, 133, 133, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
            renderer.uniqueValueInfos.push({ value: "Not Applicable", symbol: { type: "simple-fill", color: [204, 204, 204, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
            renderer.uniqueValueInfos.push({ value: "No Rating", symbol: { type: "simple-fill", color: [255, 255, 255, 0.8], outline: { color: [255, 255, 255, 0.8], width: 0.5 } } });
        }
    }
    return renderer;
};

bbbMap.ui = function () {
    bbbMap.parameters = document.getElementById("parameters");
    bbbMap.mainPanel = document.getElementById("mainPanel");
    bbbMap.mainPanelContent = document.getElementById("mainPanelContent");
    bbbMap.filterPanel = document.getElementById("filterPanel");
    bbbMap.filterContainer = document.getElementById("filterPanelContent");
    bbbMap.filterResetAction = document.getElementById("filterResetAction");

    bbbMap.bodyScrim = document.getElementById("bodyScrim");
    bbbMap.filterScrim = document.getElementById("filterScrim");

    bbbMap.parameters.style = "display: flex";

    bbbMap.view.ui.add(bbbMap.parameters, "top-right");

    const goBtn = document.getElementById("getGeocodeBtn");
    const address = document.getElementById("address");

    bbbMap.histogramContainer = document.createElement("div");

    bbbMap.filterResetAction?.addEventListener("click", async (e) => {
        bbbMap.filterReset();
    });

    goBtn?.addEventListener("click", async (e) => {
        console.log("goBtn", e, address);
        bbbMap.census.geocoder(address.value);
    });

    bbbMap.focusAreaSelect = document.createElement("calcite-select");
    bbbMap.climateDictionary.forEach((c) => {
        let option = document.createElement("calcite-option");
        option.value = c.name;
        option.innerHTML = c.alias;
        bbbMap.focusAreaSelect.appendChild(option);
    });

    let label = document.createElement("calcite-label");
    label.innerHTML = "Climate Risk Area";
    label.layout = "inline";
    label.appendChild(bbbMap.focusAreaSelect);

    bbbMap.focusAreaSelect.addEventListener("keydown", (e) => {
        console.log("select keydown", e.key);
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            bbbMap.focusAreaScrollActive = true;
        }
    });

    bbbMap.focusAreaSelect.addEventListener("keyup", (e) => {
        console.log("select keyup", e.key);
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            bbbMap.focusAreaScrollActive = false;
        }
    });

    bbbMap.focusAreaSelect.addEventListener("calciteSelectChange", (e) => {
        console.log("climate hazard change", e);
        //if (!bbbMap.focusAreaScrollActive) {
        bbbMap.focusArea = e.target.value;
        if (bbbMap?.tractShapeLayerView?.featureEffect) {
            bbbMap.tractShapeLayerView.featureEffect = "";
        }

        bbbMap.buildHistogram(bbbMap.focusArea);
        let renderer = bbbMap.getClimateRenderer(bbbMap.focusArea);
        let layer = bbbMap.map.findLayerById("tractShapes");
        if (layer && renderer) {
            layer.renderer = renderer;
            //layer.popupTemplate = bbbMap.updatePopupTemplate();
            if (bbbMap.view.popup.active) {
                bbbMap.view.openPopup(bbbMap.updatePopupTemplate());
            }
        }
        //}
    });

    bbbMap.parameters.prepend(label);

    //Add pre-defined filters

    let btn = document.createElement("calcite-button");
    btn.iconStart = "filter";
    btn.label = "Filter by State or MSA";
    //btn.innerHTML = "Pre-Defined Areas";
    btn.title = "Use Pre-Defined Areas";
    btn.addEventListener("click", async (e) => {
        console.log("Predefined Filters");

        filterPanel.closed = false;
        let h = document.getElementById("map").clientHeight;
        h = h * 0.7;
        //bbbMap.filterPanel.style.height = `${h}px`;

        if (!bbbMap.filterTypeSelect) {
            //const filterBlock = bbbMap.getBlock("Filter By", false);
            const filterLabel = document.createElement("calcite-label");

            filterLabel.innerHTML = "Filter By";
            bbbMap.filterTypeSelect = document.createElement("calcite-radio-button-group");
            bbbMap.filterTypeSelect.layout = "horizontal";

            const stateOptionLabel = document.createElement("calcite-label");
            stateOptionLabel.layout = "inline";
            stateOptionLabel.innerHTML = "State";
            const stateOption = document.createElement("calcite-radio-button");
            stateOption.value = "states";
            stateOptionLabel.appendChild(stateOption);
            bbbMap.filterTypeSelect.appendChild(stateOptionLabel);

            const msaOptionLabel = document.createElement("calcite-label");
            msaOptionLabel.layout = "inline";
            msaOptionLabel.innerHTML = "MSA";
            const msaOption = document.createElement("calcite-radio-button");
            msaOption.value = "msa";
            msaOptionLabel.appendChild(msaOption);
            bbbMap.filterTypeSelect.appendChild(msaOptionLabel);

            bbbMap.filterTypeSelect.addEventListener("calciteRadioButtonGroupChange", (e) => {
                console.log("calciteRadioButtonGroupChange", e.target.value, e);
                if (e.target.selectedItem.value === "states") {
                    bbbMap.getStates();
                } else {
                    bbbMap.getCBSA();
                }
            });
            filterLabel.appendChild(bbbMap.filterTypeSelect);
            bbbMap.filterContainer.appendChild(filterLabel);
            /*
            const optionStates = document.createElement("calcite-segmented-control-item");
            optionStates.value = "states";
            optionStates.innerHTML = "State";
            bbbMap.filterTypeSelect.appendChild(optionStates);
            const optionMSA = document.createElement("calcite-segmented-control-item");
            optionMSA.value = "msa";
            optionMSA.innerHTML = "MSA";
            bbbMap.filterTypeSelect.appendChild(optionMSA);

            bbbMap.filterTypeSelect.addEventListener("calciteSegmentedControlChange", (e) => {
                console.log("calciteSegmentedControlChange", e.target.value);
                if (e.target.value === "states") {
                    bbbMap.getStates();
                } else {
                    bbbMap.getCBSA();
                }
            });
            filterBlock.appendChild(bbbMap.filterTypeSelect);
            bbbMap.filterContainer.appendChild(filterBlock);
            */
            //bbbMap.filterContainer.appendChild(bbbMap.filterTypeSelect);
            /*
            bbbMap.filterTypeSelect = document.createElement("calcite-select");
            bbbMap.filterTypeSelect.scale = "s";
            let types = [
                { name: "-Select a Type-", value: "0", fxn: "" },
                { name: "State", value: "states", fxn: bbbMap.getStates },
                { name: "MSA", value: "msa", fxn: bbbMap.getCBSA },
            ];
            types.forEach((t) => {
                const option = document.createElement("calcite-option");
                option.value = t.value;
                option.innerText = t.name;

                bbbMap.filterTypeSelect.appendChild(option);
            });
            bbbMap.filterTypeSelect.addEventListener("calciteSelectChange", (e) => {
                console.log("Changing Filter Type", e, types);
                let t = types.find((t) => t.value === e.target.value);
                console.log("Changing Filter Type t", t);
                if (t && t.fxn) {
                    t.fxn();
                }
            });
            const label = document.createElement("calcite-label");
            label.innerHTML = "Filter Type";
            label.scale = "s";
            label.appendChild(bbbMap.filterTypeSelect);
            bbbMap.filterContainer.appendChild(label);
           */
        }

        //bbbMap.getStates();
    });
    bbbMap.view.ui.add(btn, "top-left");

    bbbMap.filterPanel.addEventListener("calcitePanelClose", () => {
        bbbMap.filterPanel.style.height = "";
    });

    bbbMap.mainPanel.addEventListener("calcitePanelClose", () => {
        if (!bbbMap.mainPanelCloseBtn) {
            bbbMap.mainPanelCloseBtn = document.createElement("calcite-button");
            bbbMap.mainPanelCloseBtn.iconStart = "information";
            bbbMap.mainPanelCloseBtn.title = "Census Demographics";
            bbbMap.mainPanelCloseBtn.addEventListener("click", async (e) => (bbbMap.mainPanel.closed = false));
            bbbMap.view.ui.add(bbbMap.mainPanelCloseBtn, "top-left");
        }
    });
};

//Filtering Functions
bbbMap.getCBSA = async function (cbsaType = "Metropolitan Statistical Area") {
    console.log("getCBSA");
    try {
        bbbMap.filterScrim.hidden = false;
        bbbMap.filterReset();

        if (true) {
            //!bbbMap.cbsaFilter) {
            bbbMap.cbsaFilter = document.createElement("div");

            bbbMap.cbsaFilter.innerHTML = "";

            let statisticType = "count";
            let q = {
                where: `CBSATYPE='${cbsaType}'`,
                geometry: bbbMap.view.extent,
            };
            q.outStatistics = [
                {
                    onStatisticField: "CBSACODE",
                    outStatisticFieldName: statisticType,
                    statisticType: statisticType,
                },
            ];
            q.groupByFieldsForStatistics = ["CBSACODE", "CBSANAME"];

            console.log("getCBSA query", q);
            const results = await bbbMap.cbsaShapeLayer.queryFeatures(q);
            console.log("getCBSA results", results);

            //let select = document.createElement("calcite-select");
            let select = document.createElement("calcite-combobox");
            select.scale = "s";
            select.placeholder = "Select an MSA";
            select.selectionMode = "single";
            select.overlayPositioning = "fixed";

            results.features.forEach((feature) => {
                //let option = document.createElement("calcite-option");
                let option = document.createElement("calcite-combobox-item");

                option.value = feature.attributes.CBSACODE;
                //option.innerHTML = `${feature.attributes.STATE} (${feature.attributes.count} tracts)`;
                option.textLabel = `${feature.attributes.CBSANAME}`;
                select.appendChild(option);
            });

            let label = document.createElement("calcite-label");
            label.innerHTML = "MSA";
            //label.layout = "inline";
            label.scale = "s";
            label.appendChild(select);

            //select.addEventListener("calciteSelectChange", async (e) => {
            select.addEventListener("calciteComboboxChange", (e) => {
                console.log("MSA change", e);
                bbbMap.getCBSACounties(e.target.value);
            });

            bbbMap.cbsaFilter.appendChild(label);
            //return bbbMap.stateFilter;
            //bbbMap.filterContainer.appendChild(bbbMap.stateFilter);
        }
        bbbMap.filterContainer.appendChild(bbbMap.cbsaFilter);
    } catch (e) {
        bbbMap.showAlert("danger", `Error Getting CBSA Filter`, `${e.message}`);
    } finally {
        bbbMap.filterScrim.hidden = true;
    }
};

bbbMap.getCBSACounties = async function (msacode) {
    try {
        bbbMap.filterScrim.hidden = false;
        if (bbbMap.countyCBSAFilter) {
            bbbMap.countyCBSAFilter.innerHTML = "";
        }
        bbbMap.countyCBSAFilter = document.createElement("div");

        let statisticType = "count";
        let q = { where: `CBSACODE='${msacode}'` };
        q.outStatistics = [
            {
                onStatisticField: "COUNTYFP",
                outStatisticFieldName: statisticType,
                statisticType: statisticType,
            },
        ];
        q.groupByFieldsForStatistics = ["COUNTYFP", "CNTY_NAME", "GEOID"];

        console.log("getMSACounties query", q);
        const results = await bbbMap.cbsaShapeLayer.queryFeatures(q);
        console.log("getMSACounties results", results);

        //let select = document.createElement("calcite-select");
        let select = document.createElement("calcite-combobox");
        select.placeholder = "Select one or more Counties";
        select.selectionMode = "multiple";
        select.scale = "s";

        results.features.forEach((feature) => {
            //let option = document.createElement("calcite-option");
            let option = document.createElement("calcite-combobox-item");

            option.value = feature.attributes.GEOID;
            option.textLabel = `${feature.attributes.CNTY_NAME}`;
            option.selected = true;
            select.appendChild(option);
        });

        let label = document.createElement("calcite-label");
        label.innerHTML = "Counties";
        label.scale = "s";
        label.appendChild(select);

        select.addEventListener("calciteComboboxChange", async (e) => {
            console.log("CountySelect change", e);
            bbbMap.applyFilter(e.target.value);
        });

        bbbMap.countyCBSAFilter.appendChild(label);

        const c = bbbMap.countyCBSAFilter.querySelector("calcite-combobox");
        const items = c.querySelectorAll("calcite-combobox-item");
        /*
        const allBtn = document.createElement("calcite-button");
        allBtn.innerHTML = "All";
        allBtn.addEventListener("click", (e) => {
            items.forEach((i) => (i.selected = true));
        });

        const noneBtn = document.createElement("calcite-button");
        noneBtn.innerHTML = "None";
        noneBtn.addEventListener("click", (e) => {
            items.forEach((i) => (i.selected = false));
        });

        bbbMap.countyCBSAFilter.appendChild(allBtn);
        bbbMap.countyCBSAFilter.appendChild(noneBtn);
        */
        bbbMap.cbsaFilter.appendChild(bbbMap.countyCBSAFilter);
        let counties = select.selectedItems.map((i) => i.value);
        bbbMap.applyFilter(counties);
    } catch (e) {
        bbbMap.showAlert("danger", `Error Getting CBSA Counties Filter`, `${e.message}`);
    } finally {
        bbbMap.filterScrim.hidden = true;
    }
};

bbbMap.filterReset = function () {
    if (bbbMap?.filterContainer) {
        if (bbbMap?.stateFilter) {
            bbbMap.filterContainer.removeChild(bbbMap.stateFilter);
            bbbMap.stateFilter = "";
        }
        if (bbbMap?.cbsaFilter) {
            bbbMap.filterContainer.removeChild(bbbMap.cbsaFilter);
            bbbMap.cbsaFilter = "";
        }
        if (bbbMap?.filterTypeSelect) {
            // bbbMap.filterTypeSelect.querySelectorAll("calcite-option").forEach((n) => (n.selected = false));
            //bbbMap.filterTypeSelect.querySelectorAll("calcite-segmented-control-item").forEach((n) => (n.checked = false));
            bbbMap.filterTypeSelect.querySelectorAll("calcite-radio-button").forEach((n) => (n.checked = false));
        }
    }
};
bbbMap.getStates = async function () {
    try {
        bbbMap.filterScrim.hidden = false;
        bbbMap.filterReset();

        if (true) {
            //!bbbMap.stateFilter) {
            bbbMap.stateFilter = document.createElement("div");

            bbbMap.stateFilter.innerHTML = "";

            let statisticType = "count";
            let q = { geometry: bbbMap.view.extent };
            q.outStatistics = [
                {
                    onStatisticField: "STATEFIPS",
                    outStatisticFieldName: statisticType,
                    statisticType: statisticType,
                },
            ];
            q.groupByFieldsForStatistics = ["STATEFIPS", "STATEABBRV", "STATE"];

            console.log("getStates query", q);
            //const results = await bbbMap.nriTractShapeLayer.queryFeatures(q);
            const results = await bbbMap.nriCountyShapeLayer.queryFeatures(q);
            console.log("getStates results", results);

            //let select = document.createElement("calcite-select");
            let select = document.createElement("calcite-combobox");
            select.scale = "s";
            select.placeholder = "Select a State";
            select.selectionMode = "single";
            select.overlayPositioning = "fixed";

            results.features.forEach((feature) => {
                //let option = document.createElement("calcite-option");
                let option = document.createElement("calcite-combobox-item");

                option.value = feature.attributes.STATEFIPS;
                //option.innerHTML = `${feature.attributes.STATE} (${feature.attributes.count} tracts)`;
                option.textLabel = `${feature.attributes.STATE}`;
                select.appendChild(option);
            });

            let label = document.createElement("calcite-label");
            label.innerHTML = "State";
            //label.layout = "inline";
            label.scale = "s";
            label.appendChild(select);

            //select.addEventListener("calciteSelectChange", async (e) => {
            select.addEventListener("calciteComboboxChange", (e) => {
                console.log("State change", e);
                bbbMap.getCounties(e.target.value);
            });

            bbbMap.stateFilter.appendChild(label);
            //return bbbMap.stateFilter;
            //bbbMap.filterContainer.appendChild(bbbMap.stateFilter);
        }

        bbbMap.filterContainer.appendChild(bbbMap.stateFilter);
    } catch (e) {
        bbbMap.showAlert("danger", `Error Getting State Filter`, `${e.message}`);
    } finally {
        bbbMap.filterScrim.hidden = true;
    }
};

bbbMap.getCounties = async function (statefips) {
    try {
        bbbMap.filterScrim.hidden = false;
        if (bbbMap.countyFilter) {
            bbbMap.countyFilter.innerHTML = "";
        }
        bbbMap.countyFilter = document.createElement("div");

        let statisticType = "count";
        let q = { where: `STATEFIPS='${statefips}'` };
        q.outStatistics = [
            {
                onStatisticField: "COUNTYFIPS",
                outStatisticFieldName: statisticType,
                statisticType: statisticType,
            },
        ];
        q.groupByFieldsForStatistics = ["COUNTYFIPS", "COUNTY", "STCOFIPS"];

        console.log("getCounties query", q);
        const results = await bbbMap.nriCountyShapeLayer.queryFeatures(q);
        console.log("getCounties results", results);

        //let select = document.createElement("calcite-select");
        let select = document.createElement("calcite-combobox");
        select.placeholder = "Select one or more Counties";
        select.selectionMode = "multiple";
        select.scale = "s";

        results.features.forEach((feature) => {
            //let option = document.createElement("calcite-option");
            let option = document.createElement("calcite-combobox-item");

            option.value = feature.attributes.STCOFIPS;
            option.textLabel = `${feature.attributes.COUNTY}`;
            //option.selected = true;

            select.appendChild(option);
        });

        let label = document.createElement("calcite-label");
        label.innerHTML = "Counties";
        label.scale = "s";
        label.appendChild(select);

        select.addEventListener("calciteComboboxChange", async (e) => {
            console.log("CountySelect change", e);
            bbbMap.applyFilter(e.target.value);
        });

        bbbMap.countyFilter.appendChild(label);

        bbbMap.stateFilter.appendChild(bbbMap.countyFilter);

        //let counties = select.selectedItems.map((i) => i.value);
        //bbbMap.applyFilter(counties);
    } catch (e) {
        bbbMap.showAlert("danger", `Error Getting County Filter`, `${e.message}`);
    } finally {
        bbbMap.filterScrim.hidden = true;
    }
};

bbbMap.applyFilter = async function (counties) {
    console.log("applyFilter", counties);
    try {
        bbbMap.summaryReportModal = "";

        if (counties) {
            bbbMap.bodyScrim.innerHTML = "Getting Tracts...";
            bbbMap.bodyScrim.hidden = false;

            const c = typeof counties === "string" ? [counties] : counties;
            let str = c.join(`','`);
            str = `'${str}'`;
            console.log("applyFilter str", str);

            if (bbbMap?.tractShapeLayer) {
                bbbMap?.tractShapeLayer.destroy();
            }

            const q = {
                where: `STCOFIPS in (${str})`,
                outFields: ["*"],
                returnGeometry: true,
                returnCentroid: true,
            };

            console.log("applyFilter Query", q);
            const count = await bbbMap.nriTractShapeLayer.queryFeatureCount(q);
            console.log("getNearbyTracts count", count);

            let results, msg;
            bbbMap.grain = "Tracts";

            if (count > bbbMap.MAX_TRACTS) {
                bbbMap.grain = "Counties";
                bbbMap.bodyScrim.innerHTML = "Getting Counties...";
                msg = `<br> Note: This area contains ${bbbMap.Number.format(count)} tracts which is over the limit of ${bbbMap.Number.format(bbbMap.MAX_TRACTS)} features.  If you are interested in Census Tract Demographics, please use a smaller area.`;
                results = await bbbMap.nriCountyShapeLayer.queryFeatures(q);
            } else {
                results = await bbbMap.nriTractShapeLayer.queryFeatures(q);
            }

            //const results = await bbbMap.nriTractShapeLayer.queryFeatures(q);
            //const results = await bbbMap.nriCountyShapeLayer.queryFeatures(q);

            //const results = await bbbMap.tractLayerView.queryFeatures(q);

            console.log("applyFilter results", results);
            if (results.features.length === 0) {
                throw new Error("Unable to find a census tract for this filter");
            }
            bbbMap.showNearbyTracts(results, null, ` ${bbbMap.grain} found using predefined filters.`);
        }
    } catch (e) {
        console.log(e);
    } finally {
        bbbMap.bodyScrim.hidden = true;
    }
};

//Tract functions
bbbMap.getNearbyTracts = async function (f, tool) {
    console.log("getNearbyTracts", f, tool);
    let feature = f ? f : bbbMap?.feature?.graphic;
    let point, geom;
    bbbMap.summaryReportModal = "";
    bbbMap.bodyScrim.innerHTML = "Getting Tracts...";
    bbbMap.bodyScrim.hidden = false;
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
        const count = await bbbMap.nriTractShapeLayer.queryFeatureCount(q);
        console.log("getNearbyTracts count", count);

        let results, msg;
        bbbMap.grain = "Tracts";

        if (count > bbbMap.MAX_TRACTS) {
            bbbMap.bodyScrim.innerHTML = "Getting Counties...";
            bbbMap.grain = "Counties";
            msg = `<br> Note: This area contains ${bbbMap.Number.format(count)} tracts which is over the limit of ${bbbMap.Number.format(bbbMap.MAX_TRACTS)} features.  If you are interested in Census Tract Demographics, please use a smaller area.`;
            results = await bbbMap.nriCountyShapeLayer.queryFeatures(q);
        } else {
            results = await bbbMap.nriTractShapeLayer.queryFeatures(q);
        }
        //const results = await bbbMap.tractLayerView.queryFeatures(q);

        console.log("getNearbyTracts results", results);
        if (results.features.length === 0) {
            throw new Error("Unable to find a census tract for this location");
        }

        bbbMap.showNearbyTracts(results, geom, msg);
    } catch (e) {
        bbbMap.bodyScrim.hidden = true;
        bbbMap.showAlert("danger", `Error Getting Tracts`, `${e.message}`);
    }
};

bbbMap.showNearbyTracts = async function (results, geom, msg = " ") {
    console.log("showNearbyTracts", results, geom);
    try {
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
        bbbMap.map.add(bbbMap.tractShapeLayer);
        bbbMap.tractShapeLayerView = await bbbMap.view.whenLayerView(bbbMap.tractShapeLayer);

        bbbMap.legendContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".esri-legend__symbol");
            if (target) {
                const rating = target.parentNode.parentNode.querySelector(".esri-legend__layer-cell--info").innerText;
                console.log("Rating");
                let dict = bbbMap.getDictionary();
                let field = `${bbbMap.focusArea}_${dict.suffix}`;
                let q = { where: `${field} = '${rating}'` };
                bbbMap.tractShapeLayerView.featureEffect = {
                    filter: q,
                    excludedEffect: "grayscale(50%) opacity(5%)",
                    includedEffect: "opacity(90%)",
                };

                q = { where };
            } else {
                bbbMap.tractShapeLayerView.featureEffect = "";
            }
        });

        bbbMap.buildHistogram();

        bbbMap.tractShapeLayer.queryExtent().then((response) => {
            bbbMap.view.goTo(response.extent.expand(1.2), bbbMap.goToOptions);
        });

        bbbMap.view.ui.add(bbbMap.legendContainer, "bottom-right");

        if (bbbMap.view.popup && bbbMap.view.popup.visible) {
            bbbMap.view.popup.close();
        }

        const btn = document.createElement("calcite-button");
        btn.innerHTML = "Summary Report";
        btn.slot = "actions-end";
        btn.iconStart = "file-report";
        btn.round = false;
        btn.id = "summaryReportBtn";

        //btn.scale = "m";
        //btn.textEnabled = true;
        btn.addEventListener("click", (e) => {
            console.log("Report Button Click", e);
            bbbMap.getSummaryReport();
        });

        const resetBtn = document.createElement("calcite-button");
        resetBtn.innerHTML = "";
        resetBtn.slot = "actions-end";
        resetBtn.iconStart = "reset";
        resetBtn.round = false;
        resetBtn.id = "summaryReportResetBtn";
        resetBtn.addEventListener("click", (e) => {
            console.log("Reset", e);
            bbbMap.summaryReportReset();
        });

        let areaText = "";
        if (geom) {
            let area = geom ? bbbMap.esri.geometryEngine.geodesicArea(geom, "square-miles") : "";
            areaText = ` ${bbbMap.grain} within ${bbbMap.Number.format(area)} square miles`;
        }
        //let radius = "";
        //if (!tool) {
        //radius = ` (radius of ${bbbMap.BUFFER_SIZE} miles)`;
        //} //${radius}
        //const area = bbbMap.esri.geometryEngine.geodesicArea(geom, 'square-miles');

        bbbMap.showAlert("success", `${bbbMap.grain} Found`, `${results.features.length}${areaText}${msg}`, [btn, resetBtn]);
        //}
    } catch (e) {
        bbbMap.showAlert("danger", `Error Showing Tracts`, `${e.message}`);
    } finally {
        bbbMap.bodyScrim.hidden = true;
    }
};

bbbMap.buildHistogram = async function (area = bbbMap.focusArea) {
    console.log("buildHistogram", area);

    bbbMap.histogramContainer.innerHTML = "";
    bbbMap.view.ui.remove(bbbMap.histogramContainer);

    if (bbbMap.tractShapeLayerView) {
        let dict = bbbMap.getDictionary();
        let score = dict.type === "hazard" ? "RISKS" : "SCORE";
        //let field = dict.legendField;
        let field = `${area}_${score}`;

        bbbMap.tractShapeLayerView.filter = "";
        bbbMap.histogramContainer.innerHTML = `Histogram for ${dict.alias}`;
        bbbMap.histogramContainer.style.setProperty("background-color", "var(--calcite-color-background)");
        bbbMap.histogramContainer.style.setProperty("color", "var(--calcite-color-inverse)");

        const stats = await bbbMap.esri.summaryStatistics({
            layer: bbbMap.tractShapeLayer,
            field: field,
            view: bbbMap.view,
        });

        console.log("buildHistogram Stats", stats);

        results = await bbbMap.esri.histogram({
            layer: bbbMap.tractShapeLayer,
            field: field,
            numBins: 50,
            minValue: 0, //stats.min,
            maxValue: 100, //stats.max,
            average: stats.avg,

            //classificationMethod: "standard-deviation", //"equal-interval","natural-breaks","quantile","standard-deviation"
            //normalizationType: "log", //"field", "log", "percent-of-total", "natural-log", "square-root"
        });

        console.log("histogram results", results);

        const sliderContainer = document.createElement("div");

        const slider = new bbbMap.esri.HistogramRangeSlider({
            bins: results.bins,
            min: 0, //stats.min,
            max: 100, //stats.max,
            average: stats.avg,
            standardDeviation: stats.stddev,
            //standardDeviationCount: 3,
            values: [0, 100], //[stats.min, stats.max],
            //dataLines: [{ value: stats.avg, label: "Avg" }],
            rangeType: "between",
            includedBarColor: "#009AF2",
            excludedBarColor: "#4A4A4A",
            container: sliderContainer,
            /* barCreatedFunction: (i, e) => {
                //console.log("barCreatedFunction", i, e);
                const bin = results.bins[i];
                //const midValue = ((bin.maxValue - bin.minValue) / 2) + bin.minValue;
                const c = bbbMap.getColorFromValue(bin.minValue, bin.maxValue);
                e.setAttribute("fill", c);
                e.setAttribute("fill-opacity", "0.5");
                e.setAttribute("stroke", "#ffffff");
                // e.setAttribute("stroke-width", "1");
                e.setAttribute("stroke-opacity", "0.7");
            },*/
        });

        slider.on(["thumb-change", "thumb-drag", "segment-drag", "min-change", "max-change"], (event) => {
            bbbMap.histogramWhere = slider.generateWhereClause(field);
            //console.log("where", where);
            bbbMap.tractShapeLayerView.filter = {
                where: bbbMap.histogramWhere,
            };
        });

        bbbMap.histogramContainer.appendChild(sliderContainer);
        bbbMap.view.ui.add(bbbMap.histogramContainer, "bottom-left");
    }
};

bbbMap.getColorFromValue = function (min, max) {
    console.log("getColorFromValue", min, max);
    let rtn = "";
    /*
    bbbMap.tractShapeLayer.renderer.uniqueValueInfos.forEach(uv => console.log(uv.value, uv.symbol.color.toHex()));
97 Very High #c7445d
85 Relatively High #e07069
60 Relatively Moderate #f0d55d
27 Relatively Low #509bc7
0.5 Very Low #4d6dbd
other #9e9e9e
*/
    if (min > 97) {
        rtn = "#c7445d";
    } else if (min > 85) {
        rtn = "#e07069";
    } else if (min > 60) {
        rtn = "#f0d55d";
    } else if (min > 25) {
        rtn = "#509bc7";
    } else if (min > 0.5) {
        rtn = "#4d6dbd";
    } else {
        rtn = "#9e9e9e";
    }

    return "#009AF2";
};

bbbMap.getPopupTemplate = function () {
    //let a = bbbMap.climateDictionary.find((c) => c.name === bbbMap.focusArea);
    let a = bbbMap.getDictionary();
    const template = {
        title: `Tract: {TRACT}`, //${a.alias} for
        content: bbbMap.getPopupContent,
    };
    return template;
};

bbbMap.updatePopupTemplate = function (feature = bbbMap.feature) {
    if (feature) {
        let a = bbbMap.getDictionary();
        console.log("updatePopupTemplate", a, feature);
        const template = {
            title: `Tract: ${feature.graphic.attributes.TRACT}`, //${a.alias} for
            content: bbbMap.getPopupContent(feature),
            //features: [bbbMap.feature.graphic],
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
        content += `<div><h2>${dict.alias}</h2><h3>${status} </h3>  </div>`;
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

//FFIEC functions
bbbMap.refreshTractInfo = function (f = bbbMap.feature.graphic) {
    console.log("refreshTractInfo", f);
    let feature = f ? f : bbbMap?.feature?.graphic;
    let p;
    if (feature && feature.geometry) {
        if (feature.geometry.type === "polygon") {
            const labelPoint = bbbMap.esri.labelPointOperator.execute(feature.geometry);
            // p = { latitude: feature.geometry.centroid.latitude, longitude: feature.geometry.centroid.longitude, type: "point" };
            p = { latitude: labelPoint.latitude, longitude: labelPoint.longitude, type: "point" };
        } else {
            p = { latitude: feature.geometry.latitude, longitude: feature.geometry.longitude, type: "point" };
        }
    } else {
        p = bbbMap.point;
    }

    bbbMap.getFFIEC(p, { matchedAddress: "Click" });
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
            //console.log("...Adding Tab", column.name, val);
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

bbbMap.getTable = function (bordered = true, striped = true, scale = "s") {
    const table = document.createElement("calcite-table");
    table.bordered = bordered;
    table.interactionMode = "static";
    table.layout = "auto";
    table.striped = striped;
    table.scale = scale;
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
    color: [255, 255, 0, 0.001],
    outline: {
        color: [255, 255, 0, 0.05],
        width: 0.5,
    },
};

/*
            report: [
                { title: "Avg Resilience Score", fxn: bbbMap.getAvg },
                { title: "Min Resilience Score", fxn: bbbMap.getMin },
                { title: "Max Resilience Score", fxn: bbbMap.getMax },
            ],
bbbMap.climateCategories.map((c) => {
    let cols = temp1.filter((t) => t.name.includes(`${c.name}_`));
    let m = cols.map((t) => {
        return { name: t.name, alias: t.alias, type: t.type };
    }); // {name: t.name, alias: t.alias, type: t.type});
    c["cols"] = m;
    return c;
});
*/

//Reporting
bbbMap.summaryReportReset = function () {
    bbbMap.tractShapeLayerView.featureEffect = "";
};

bbbMap.getSumByGroup = function (groupBy, data = bbbMap?.tractShapeLayerSource?.source, sumAttr = "") {
    console.log("xxxgetSumByGroup", groupBy, data, sumAttr);
    let rtn = "";
    try {
        if (data) {
            rtn = data.reduce((acc, item) => {
                if (!acc[item.attributes[groupBy]]) {
                    acc[item.attributes[groupBy]] = 0;
                }

                if (sumAttr) {
                    acc[item.attributes[groupBy]] += item.attributes[sumAttr];
                } else {
                    acc[item.attributes[groupBy]] += 1;
                }
                return acc;
            }, {});
        }
    } catch (e) {
        console.log("Error getting getSumByGroup", e, groupBy, data, sumAttr);
    }
    return rtn;
};

bbbMap.getSum = function (attr, data = bbbMap?.tractShapeLayerSource?.source) {
    let rtn = "";
    try {
        if (data) {
            rtn = data.reduce((sum, item) => sum + item.attributes[attr], 0);
            //rtn = data.reduce((sum, item) => sum + item[attr], 0);
        }
    } catch (e) {
        console.log("Error getting Sum", e, attr);
    }
    return rtn;
};

bbbMap.getAvg = function (attr, data = bbbMap?.tractShapeLayerSource?.source) {
    let rtn = "";
    try {
        if (data) {
            let d = data.map((f) => f.attributes[attr]);
            d = d.filter((d) => !isNaN(d) && d > 0);
            //rtn = data.reduce((sum, item) => sum + item.attributes[attr], 0) / data.length;
            rtn = d.reduce((sum, item) => sum + item, 0) / data.length;
        }
    } catch (e) {
        console.log("Error getting Avg", e, attr);
    }
    return rtn;
};

bbbMap.getMin = function (attr, data = bbbMap?.tractShapeLayerSource?.source) {
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

bbbMap.getMax = function (attr, data = bbbMap?.tractShapeLayerSource?.source) {
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

bbbMap.applyFxn = function (fxn, attr, data) {
    return fxn(attr, data);
};

bbbMap.buildSummaryReportHeader = function (data) {
    let tracts = data.length;
    let area = bbbMap.getSum("AREA", data);
    let counties = [...new Set(data.map((i) => `${i.attributes.COUNTY}, ${i.attributes.STATE}`))];
    //let counties = [...new Set(data.map((i) => `${i.COUNTY}, ${i.STATE}`))];
    let countyTxt = counties.join("; ");
    const headerDiv = document.createElement("div");
    headerDiv.innerHTML = `<h3>Tracts: ${bbbMap.Number.format(tracts)} <br>Counties: ${countyTxt}<BR>Area ${bbbMap.Number.format(area)} square miles</h3>`;
    bbbMap.summaryReportModal.appendChild(headerDiv);
    return headerDiv;
};

bbbMap.buildSummaryReportContent = function (data) {
    //build report struture
    const climateBlock = bbbMap.getBlock("Climate");
    const container = document.createElement("div");
    container.classList.add("searchCardContainer");

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

        const block = bbbMap.getBlock(g?.reportName);
        //block.style = "width: 30%";
        const table = bbbMap.getTable(true, false);
        table.layout = "fixed";

        g.report.forEach((e) => {
            //console.log("Report", e);
            let val = bbbMap.applyFxn(e.fxn, g.name, data);
            let title = e.title;
            //console.log("here we go", val, title);
            table.appendChild(bbbMap.addRow(title, bbbMap[g.type].format(val)));
        });
        block.appendChild(table);
        container.appendChild(block);
    });

    climateBlock.appendChild(container);

    const groupByContainer = document.createElement("div");
    groupByContainer.classList.add("searchCardContainer");

    const groupByConfig = [
        { title: "Risk Rating", groupBy: "RISK_RATNG", sumAttr: "", format: "Number" },
        { title: "Social Vulnerability Rating", groupBy: "SOVI_RATNG", sumAttr: "", format: "Number" },
        { title: "Community Resiliance Rating", groupBy: "RESL_RATNG", sumAttr: "", format: "Number" },
    ];
    groupByConfig.forEach((b) => {
        const block = bbbMap.buildGroupByTables(data, b);
        groupByContainer.appendChild(block);
    });
    climateBlock.appendChild(groupByContainer);

    return climateBlock;
};

bbbMap.doChartHazardUpdate = function (hazard) {
    console.log("doChartHazardUpdate", hazard);
    const dict = bbbMap.climateDictionary.find((d) => d.alias === hazard);

    const field = `${dict.name}_EALT`;
    let label = bbbMap.grain === "Counties" ? "COUNTY" : "TRACTFIPS";

    let data = bbbMap?.reportData;
    let chart = bbbMap?.chart?.singleHazardLossChart;

    if (data && chart) {
        const singleHazardLossData = data.map((d) => {
            return { label: d.attributes[label], x: d.attributes[field] };
        });
        singleHazardLossData.sort((a, b) => b.x - a.x);
        singleHazardLossConfig = {
            labels: singleHazardLossData.map((m) => m.label),
            datasets: [{ label: `${dict.alias}`, data: singleHazardLossData.map((m) => m.x), borderColor: "#e7a369" }],
        };

        chart.data = singleHazardLossConfig;
        chart.update();
    }
};

bbbMap.doChartClickHazardPicker = function (data) {
    return (event, elements) => {
        if (elements && elements.length > 0) {
            const point = elements[0];
            const hazard = data.labels[point.index];

            bbbMap.hazardSelect.value = hazard;
            bbbMap.doChartHazardUpdate(hazard);
        }
    };
};

bbbMap.doChartClickZoom = function (data) {
    return async (event, elements) => {
        console.log("doChartClickZoom", event, elements, data);
        if (elements && elements.length > 0) {
            const point = elements[0];
            const label = data.labels[point.index];
            const value = data.datasets[point.datasetIndex].data[point.index];

            console.log("click", point, label, value);

            let results = await bbbMap.getTractGeom(label);

            let geoid = label;
            let q = { where: `TRACTFIPS = '${geoid}'` };

            bbbMap.tractShapeLayerView.featureEffect = {
                filter: q,
                excludedEffect: "grayscale(50%) opacity(33%)",
                includedEffect: " opacity(90%)", //bloom(1.5, 0.5px, 0.1)
            };
            bbbMap.sketchLayer.removeAll();

            bbbMap.summaryReportModal.open = false;
            bbbMap.view.goTo(results.features[0].geometry.extent.expand(1.5), bbbMap.goToOptions);
        }
    };
};
bbbMap.getChart = function (
    data,
    type,
    title = "Chart",
    xLabel = "",
    yLabel = "",
    clickFxn = (data) => {
        return (e, element) => {
            console.log("clicky", e, element, data);
        };
    }
) {
    // let data = bbbMap?.tractShapeLayerSource?.source;
    const block = document.createElement("calcite-block");
    block.heading = title;
    block.open = true;
    block.collapsible = true;

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = type === "line" || type === "bar" ? "350px" : "100%";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    //canvas.width = "300";
    //canvas.height = "200";
    container.appendChild(canvas);
    block.appendChild(container);
    //console.log("canvas", container, canvas);

    //let labels = data.map((d) => d.attributes.TRACT);
    //let risk_score = data.map((d) => d.attributes.RISK_SCORE);
    let scales =
        type === "radar"
            ? { r: { pointLabels: { color: "white", font: { size: 9 } }, ticks: { color: "red", display: false }, grid: { color: "rgba(255, 255, 255, 0.3)" }, angleLines: { color: "rgba(255, 255, 255, 0.3)" } } }
            : {
                  x: { title: { display: true, text: xLabel } },
                  y: { title: { display: true, text: yLabel } },
                  //r: { pointLabels: { font: { size: 9 } }, ticks: {color: "red", display: false } },
              };

    const chart = new Chart(ctx, {
        type: type,
        data: data,
        options: {
            scales: scales,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true,
                },
                legend: {
                    display: true,
                },
                /*
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "xy",
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        mode: "xy",
                    },
                },*/
            },
            onClick: clickFxn(data),
        },
    });
    //}, 100);
    return { block, chart };
};

bbbMap.buildCharts = function (data, container = bbbMap.summaryReportModal) {
    console.log("buildCharts", data, container);
    bbbMap.chart = {};
    const dict = bbbMap.getDictionary();
    console.log("Chart Dictionary", dict);
    //Charts

    let label = bbbMap.grain === "Counties" ? "COUNTY" : "TRACTFIPS";
    let chartData = data.map((d) => {
        return { label: d.attributes[label], x: d.attributes.RISK_SCORE, y: d.attributes.SOVI_SCORE, eal: d.attributes.EAL_SCORE };
    });

    chartData.sort((a, b) => a.x - b.x);
    let meep = {
        labels: chartData.map((m) => m.label), //, "SOVI", "EAL", "RESL"],
        datasets: [
            {
                label: "Risk Index Score",
                data: chartData.map((m) => m.x), //, data.attributes.EAL_SCORE, data.attributes.SOVI_SCORE, data.attributes.RESL_SCORE],
                borderColor: "#ff8a8e", // Color of the line
            },
            {
                label: "Social Vulnerability Index (SVI)",
                data: chartData.map((m) => m.y), //, data.attributes.EAL_SCORE, data.attributes.SOVI_SCORE, data.attributes.RESL_SCORE],
                borderColor: "#aadd67", // Color of the line
            },
        ],
    };

    let block, chart;
    ({ block, chart } = bbbMap.getChart(meep, "line", "Risk Chart", bbbMap.grain, "Score", bbbMap.doChartClickZoom));
    container.appendChild(block);

    let scatter = {
        labels: chartData.map((m) => m.label),
        datasets: [
            {
                label: "Scatter Plot",
                data: chartData,
                borderColor: "rgba(255, 138, 142, 0.9)",
                pointRadius: 4,
                backgroundColor: "rgba(255, 138, 142, 0.6)",
            },
        ],
    };

    ({ block, chart } = bbbMap.getChart(scatter, "scatter", "Scatter Chart", "Risk Score", "Social Vulerability Score", bbbMap.doChartClickZoom));
    container.appendChild(block);

    //All Hazards
    let h = bbbMap.climateDictionary.filter((d) => d.type === "hazard");
    let hazardRiskData = h.map((h) => {
        let rtn = { name: `${h.name}_RISKS`, alias: h.alias };
        rtn.value = bbbMap.getAvg(rtn.name, data);
        return rtn;
    });

    hazardRiskData = hazardRiskData.filter((d) => d.value > 0);

    hazardRiskData.sort((a, b) => b.value - a.value);

    let hazardRiskConfig = {
        labels: hazardRiskData.map((m) => m.alias),
        datasets: [
            {
                label: "Hazard",
                data: hazardRiskData.map((m) => m.value),
                backgroundColor: "rgba(231, 163, 105, 0.5)",
                borderColor: "rgba(231, 163, 105, 0.75)",
                borderWidth: 2,
            },
        ],
    };
    //const radarChart = bbbMap.getChart(radarConfig, "radar", "Hazard Risk Averages (Only non-zero)");
    //bbbMap.summaryReportModal.appendChild(radarChart);

    ({ block, chart } = bbbMap.getChart(hazardRiskConfig, "bar", "Hazard Risk Averages"));
    container.appendChild(block);
    //const ealChart = bbbMap.getChart("EAL_VALT", "Expected Annual Loss Chart");
    //modal.appendChild(ealChart);

    //EALT
    let ealt = bbbMap.climateDictionary.filter((d) => d.type === "hazard");
    let ealtData = ealt.map((ealt) => {
        let rtn = { name: `${ealt.name}_EALT`, alias: ealt.alias };
        rtn.value = bbbMap.getSum(rtn.name, data);
        return rtn;
    });

    //radarData = radarData.filter((d) => d.value > 0);
    ealtData = ealtData.filter((d) => d.value > 0);
    ealtData.sort((a, b) => b.value - a.value);
    let ealtConfig = {
        labels: ealtData.map((m) => m.alias),
        datasets: [
            {
                label: "Hazard",
                data: ealtData.map((m) => m.value),
                backgroundColor: "rgba(231, 163, 105, 0.5)",
                borderColor: "rgba(231, 163, 105, 0.75)",
                borderWidth: 2,
            },
        ],
    };
    ({ block, chart } = bbbMap.getChart(ealtConfig, "bar", "Total Estimated Loss by Hazard ($)", "Hazard", "EAL", bbbMap.doChartClickHazardPicker));

    container.appendChild(block);

    //Single Hazard
    let field, datasetLabel;
    if (dict.type === "hazard") {
        field = `${dict.name}_EALT`;
        datasetLabel = dict.alias;
    } else {
        const maxHazard = bbbMap.climateDictionary.find((d) => d.alias === ealtConfig.labels[0]);
        field = `${maxHazard.name}_EALT`;
        datasetLabel = maxHazard.alias;
    }

    let zData = data.map((d) => {
        return { label: d.attributes[label], x: d.attributes[field] };
    });

    console.log("build hazard chart", field, zData);
    zData.sort((a, b) => b.x - a.x);

    let zConfig = {
        labels: zData.map((m) => m.label), //, "SOVI", "EAL", "RESL"],
        datasets: [
            {
                label: `${datasetLabel}`,
                data: zData.map((m) => m.x),
                borderColor: "#e7a369",
            },
        ],
    };

    ({ block, chart } = bbbMap.getChart(zConfig, "line", `${dict.alias} Total EAL`, bbbMap.grain, "Expected Annual Loss", bbbMap.doChartClickZoom));
    bbbMap.chart.singleHazardLossChart = chart;

    bbbMap.hazardSelect = document.createElement("calcite-select");
    bbbMap.hazardSelect.scale = "s";
    ealtData.forEach((hazard) => {
        const option = document.createElement("calcite-option");
        option.value = hazard.alias;
        option.innerHTML = hazard.alias;

        if (hazard.alias === datasetLabel) {
            option.selected = true;
        }
        bbbMap.hazardSelect.appendChild(option);
    });

    bbbMap.hazardSelect.addEventListener("calciteSelectChange", (e) => {
        console.log("bbbMap.hazardSelect calciteSelectChange", e);
        let hazard = `${e.target.value}`;
        bbbMap.doChartHazardUpdate(hazard);
    });

    block.prepend(bbbMap.hazardSelect);
    container.appendChild(block);
};

bbbMap.buildGroupByTables = function (data, config) {
    console.log("buildGroupByTables", data, config);
    const d = bbbMap.getSumByGroup(config.groupBy, data, config.sumAttr);
    const sortedData = Object.entries(d).sort((a, b) => b[1] - a[1]);

    const block = bbbMap.getBlock(config.title);
    const table = bbbMap.getTable(true, false);

    sortedData.forEach((d) => {
        table.appendChild(bbbMap.addRow(d[0], bbbMap[config.format].format(d[1])));
    });
    block.appendChild(table);
    return block;
};

bbbMap.getSummaryReport = async function () {
    console.log("getSummaryReport");
    Chart.defaults.color = "#bfbfbf";
    //Chart.defaults.datasets.bar.backgroundColor = "rgba(231, 163, 105, 0.95)";
    //Chart.defaults.datasets.bar.borderColor = "rgba(231, 163, 105, 0.5)";

    //Chart.defaults.borderColor = "#e7a369";
    //if it's already built, and the filter is the same, just open the modal
    if (bbbMap.summaryReportModal && bbbMap.histogramWhere === bbbMap.histogramWhereOld && bbbMap.focusArea === bbbMap.focusAreaOld) {
        bbbMap.summaryReportModal.open = true;
    } else {
        //otherwise, build the report
        bbbMap.summaryReportModal = document.createElement("calcite-dialog");

        bbbMap.summaryReportModal.modal = true;
        bbbMap.summaryReportModal.open = true;
        bbbMap.summaryReportModal.heading = "Area Summary Report";
        bbbMap.summaryReportModal.slot = "dialogs";
        //modal.scale = "l";
        bbbMap.summaryReportModal.widthScale = "l";

        bbbMap.summaryReportContainer = document.createElement("div");
        bbbMap.summaryReportContainer.id = "summaryReportContainer";

        //let s = [{ name: "EAL_VALT", alias: "Total Estimated Loss", format: "USDollar" }];
        //let data = bbbMap.tractShapeLayerSource.source;
        let where = bbbMap.histogramWhere ? bbbMap.histogramWhere : "1=1";
        const results = await bbbMap.tractShapeLayer.queryFeatures({ where: where });
        const data = results.features;
        bbbMap.reportData = data;
        //get tract refernce data
        /*
        let ids = data.map((s) => s.attributes.TRACTFIPS);
        let tractWhere = ids.join(`','`);
        tractWhere = `GEOID IN ('${tractWhere}')`;
        console.log(tractWhere);
        const tracts = await bbbMap.tractLayer.queryFeatures({ where: tractWhere, outFields: ["GEOID", "B17020_calc_pctPovE"] });
        tractData = tracts.features;
        const joinData = data.map((d) => {
            const ref = tractData.find((r) => r.attributes.GEOID === d.attributes.TRACTFIPS);
            return { ...d.attributes, ...ref.attributes };
        });
*/
        //let map = new Map(tractData.map((item) => [item.attributes["GEOID"], item.attributes.B17020_calc_pctPovE]));
        //joinData = data.map((item) => ({
        //  ...item.attributes.TRACTFIPS,
        //  ...map.get(item.attributes["GEOID"]),
        //}));

        console.log("getSummary", results, data);
        //Header
        const header = bbbMap.buildSummaryReportHeader(data);
        //const header = bbbMap.buildSummaryReportHeader(joinData);
        bbbMap.summaryReportContainer.appendChild(header);

        //Content
        const content = bbbMap.buildSummaryReportContent(data);
        bbbMap.summaryReportContainer.appendChild(content);

        bbbMap.buildCharts(data, bbbMap.summaryReportContainer);
        bbbMap.summaryReportModal.appendChild(bbbMap.summaryReportContainer);
        document.querySelector("calcite-shell").appendChild(bbbMap.summaryReportModal);
    }

    bbbMap.histogramWhereOld = bbbMap.histogramWhere;
    bbbMap.focusAreaOld = bbbMap.focusArea;
};

bbbMap.climateDictionary = [
    { name: "RISK", alias: "National Risk Index (NRI)", type: "nri", suffix: "RATNG" },
    { name: "SOVI", alias: "Social Vulnerability Index (SVI)", type: "sovi", suffix: "RATNG" },
    { name: "EAL", alias: "Expected Annual Loss (EAL)", type: "eal", suffix: "RATNG" },
    { name: "RESL", alias: "Community Resilience", type: "resl", suffix: "RATNG" },
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
                { title: "Avg Risk Score (All Tracts)", fxn: bbbMap.getAvg },
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
                { title: "Total Estimated Loss (All Tracts)", fxn: bbbMap.getSum },
                { title: "Avg Estimated Loss (All Tracts)", fxn: bbbMap.getAvg },
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
                { title: "Avg EAL Score (All Tracts)", fxn: bbbMap.getAvg },
                { title: "Min EAL Score", fxn: bbbMap.getMin },
                { title: "Max EAL Score", fxn: bbbMap.getMax },
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
        { name: "SOVI_RATNG", alias: "Rating", type: "string", category: "SVI" },
        {
            name: "SOVI_SCORE",
            alias: "Score",
            type: "Number",
            category: "SVI",
            reportName: "Social Vulnerability",
            report: [
                { title: "Avg SVI Score", fxn: bbbMap.getAvg },
                { title: "Min SVI Score", fxn: bbbMap.getMin },
                { title: "Max SVI Score", fxn: bbbMap.getMax },
            ],
        },
        { name: "SOVI_SPCTL", alias: "State Percentile", type: "Number", category: "SVI" },
    ],
    resl: [
        { name: "RESL_RATNG", alias: "Rating", type: "string", category: "Resilience" },
        {
            name: "RESL_SCORE",
            alias: "Score",
            type: "Number",
            category: "Resilience",
            reportName: "Community Resilience Score",
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
        //{ name: "EXPP", alias: "Population", type: "Number", category: "Exposure" },
        { name: "EXPPE", alias: "Population Equivalence", type: "USDollar", category: "Exposure" },
        { name: "EXPA", alias: "Agriculture Value", type: "USDollar", category: "Exposure" },
        { name: "EXPT", alias: "Total", type: "Number", category: "Exposure" },

        { name: "HLRR", alias: "Total Rating", type: "string", category: "Historic Loss Ratio" },
        { name: "HLRB", alias: "Buildings", type: "Number", category: "Historic Loss Ratio" },
        { name: "HLRP", alias: "Population", type: "Number", category: "Historic Loss Ratio" },
        { name: "HLRA", alias: "Agriculture", type: "Number", category: "Historic Loss Ratio" },

        { name: "EALR", alias: "Rating", type: "string", category: "Expected Annual Loss" },
        { name: "EALS", alias: "Score", type: "Number", category: "Expected Annual Loss" },
        { name: "EALT", alias: "Total", type: "USDollar", category: "Expected Annual Loss" },
        { name: "ALR_NPCTL", alias: "National Percentile", type: "Number", category: "Expected Annual Loss" },
        { name: "EALB", alias: "Building Value", type: "USDollar", category: "Expected Annual Loss" },
        //{ name: "EALP", alias: "Population", type: "Number", category: "Expected Annual Loss" },
        { name: "EALPE", alias: "Population Equivalence", type: "USDollar", category: "Expected Annual Loss" },
        { name: "EALA", alias: "Agriculture Value", type: "USDollar", category: "Expected Annual Loss" },

        { name: "ALRB", alias: "Building Rate", type: "Number", category: "Expected Annual Loss" },
        { name: "ALRP", alias: "Population Rate", type: "Number", category: "Expected Annual Loss" },
        { name: "ALRA", alias: "Agriculture Rate", type: "Number", category: "Expected Annual Loss" },
    ],
};

bbbMap.Number = new Intl.NumberFormat("en-US");
bbbMap.USDollar = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0, style: "currency", currency: "USD" });

bbbMap.BUFFER_SIZE = 3;
bbbMap.MAX_AREA = 25000;
bbbMap.MAX_TRACTS = 1000;
bbbMap.focusArea = "RISK";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
    bbbMap.init();
});
