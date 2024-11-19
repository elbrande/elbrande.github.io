const bbbMap = {};

bbbMap.init = () => {
    console.log("bbbMap.init");
    bbbMap.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";
    bbbMap.censusTractService = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Median_Income_by_Race_and_Age_Selp_Emp_Boundaries/FeatureServer/2";
    bbbMap.goToOptions = { animate: true, animationMode: "auto", duration: 1000, maxDuration: 2000, easing: "ease" };
    bbbMap.initMap();
};

bbbMap.initMap = () => {
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/FeatureTable", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/LayerList", "esri/widgets/Legend", "esri/widgets/Print", "esri/widgets/Search", "esri/core/reactiveUtils", "esri/geometry/geometryEngine", "esri/geometry/support/webMercatorUtils", "esri/geometry/Point", "esri/widgets/Sketch", "esri/smartMapping/renderers/color"], (esriConfig, Map, MapView, FeatureLayer, FeatureTable, GraphicsLayer, Graphic, BasemapGallery, LayerList, Legend, Print, Search, reactiveUtils, geometryEngine, webMercatorUtils, Point, Sketch, colorRendererCreator) =>
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

            console.log("Building Map");

            bbbMap.map = new Map({ basemap: "arcgis-dark-gray" });

            bbbMap.view = new MapView({
                map: bbbMap.map,
                center: [-96.3537, 40.6698],
                zoom: 4,
                highlightOption: {
                    color: [255, 255, 0, 0.75],
                    haloOpacity: 0.8,
                    fillOpacity: 0.25,
                },
                popupEnabled: true,
                popup: {
                    viewModel: { includeDefaultActions: 0 },
                    defaultPopupTemplateEnabled: 1,
                    actions: [
                        { title: "Nearby Tracts", id: "find-nearby-tracts", icon: "polygon" },
                        { title: "Refresh Census Demographics", id: "refresh-tract-info", icon: "information" },
                    ],
                    dockEnabled: 0,
                    dockOptions: {
                        buttonEnabled: 0,
                        breakpoint: 0,
                    },
                },
                container: "map",
            });

            bbbMap.legendContainer = document.createElement("div");
            bbbMap.legendWidget = new Legend({ view: bbbMap.view, container: bbbMap.legendContainer });

            console.log("adding shape service");
            bbbMap.censusTractShapeService = new FeatureLayer({ id: "censusTractService", url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Median_Income_by_Race_and_Age_Selp_Emp_Boundaries/FeatureServer/2" });

            console.log("graphics layer");
            bbbMap.graphicsLayer = new GraphicsLayer({ id: "graphicsLayer", popupEnabled: 1, title: "Graphics" });
            bbbMap.map.add(bbbMap.graphicsLayer);

            bbbMap.censusTractShapeLayer = new FeatureLayer({ id: "censusTractService", url: bbbMap.censusTractService });

            bbbMap.view.on("immediate-click", (e) => {
                console.log("Map click", e);
                if (e.button === 2) {
                    bbbMap.point = e.mapPoint;
                    bbbMap.view.openPopup({
                        title: "User Selection",
                        content: `Clicked ${e.mapPoint.latitude}, ${e.mapPoint.longitude} refresh census demographics to analyze this point`,
                        location: e.mapPoint,
                    });
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
                        console.log("Popup Call: find-nearby-branches");
                        bbbMap.getNearbyTracts(feature);
                        //bbbMap.getNearbyBranches(bbbMap.view.popup.selectedFeature, bbbMap._bufferSize);
                    }
                    if (e.action.id === "refresh-tract-info") {
                        console.log("Popup Call: refresh-tract-info");
                        bbbMap.refreshTractInfo(feature);
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
                console.log("Map.view created", view);
                bbbMap.ui();

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

bbbMap.showAlert = function (type, title, msg) {
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

bbbMap.finishSketch = function (graphic, tool) {
    console.log("finishSketch", graphic, tool);
    if (graphic && graphic.geometry) {
        let size = bbbMap.esri.geometryEngine.geodesicArea(graphic.geometry, "square-miles");
        if (size > bbbMap.MAX_AREA) {
            bbbMap.showAlert("error", `Shape Error with ${tool}`, `Shape is over the ${bbbMap.MAX_AREA} square mile limit (area is ${bbbMap.Number.format(size)}).  Please try again.`);
        } else {
            bbbMap.showAlert("success", `Filtering with ${tool}`, `Looking for tracts in ${bbbMap.Number.format(size)} square miles.`);
            //const div = document.createElement("div");
            //div.innerHTML = `Looking for tracts in ${bbbMap.Number.format(size)} square mile ${tool}.`;
            //bbbMap.view.ui.add(div, "top-left");
            bbbMap.getNearbyTracts(graphic, tool);
        }
    }
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

        console.log("getNearbyTracts results", results);
        if (results.features.length === 0) {
            throw new Error("Unable to find a census tract for this location");
        }

        let layer = { id: "tractShapes", title: "Census Tract Shapes", opacity: 0.75, outFields: ["*"], popupEnabled: 1, renderer: { type: "simple", symbol: { type: "simple-fill", color: [183, 172, 131, 0.5], outline: { color: [255, 255, 255, 0.75], width: 0.1 } } }, legendEnabled: 1, visible: 1, fields: results.fields, source: results.features };
        bbbMap.tractShapeLayer = new bbbMap.esri.FeatureLayer(layer);

        const response = await bbbMap.esri.colorRendererCreator.createContinuousRenderer({
            layer: bbbMap.tractShapeLayer,
            field: "B19049_001E",
            view: bbbMap.view,
            baseMape: bbbMap.map.basemap,
        });
        bbbMap.tractShapeLayer.renderer = response.renderer;

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
        bbbMap.showAlert("success", `Success`, `Found ${results.features.length} tracts within ${bbbMap.Number.format(area)} square miles.`);
        //}
    } catch (e) {
        bbbMap.showAlert("error", `Error Getting Tracts`, `${e.message}`);
    }
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

    let attributes = Object.assign({}, point, ffiecResults, { matchedAddress: census.matchedAddress });

    console.log("attributes", attributes);

    const popupTemplate = {
        title: "{matchedAddress}",
        content: "This tract has a stuff",
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

bbbMap.Number = new Intl.NumberFormat("en-US");
bbbMap.USDollar = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0, style: "currency", currency: "USD" });

bbbMap.BUFFER_SIZE = 3;
bbbMap.MAX_AREA = 100;
