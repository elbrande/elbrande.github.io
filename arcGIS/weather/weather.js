/*jslint esnext:true*/
const bbbMap = {};
bbbMap.versionNumber = "2.2.0.0";
bbbMap.ui = {};
bbbMap.layerViews = [];

bbbMap.ready = function (mapConfig) {
    console.log(bbbMap.versionNumber, "Promise is ready ", mapConfig);
    mapConfig = typeof mapConfig === "string" ? JSON.parse(mapConfig) : mapConfig;
    bbbMap._config = mapConfig;

    console.log("building Map", bbbMap._config);
    //Map
    bbbMap.buildMap(mapConfig);
};

bbbMap.initCap = function (str) {
    return str
        .toLowerCase()
        .split(" ")
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
};

bbbMap.catch = function (e) {
    console.log("Promise Failed", e);

    document.querySelector("calcite-loader").active = false;
    document.body.append("<h1>Error Retreiving Map Definition for &REQUEST.</h1>");
    document.body.append(e.message);
};

bbbMap.set = function (el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

/*
bbbMap.bbbAPEXFeatureLayer = function (layerConfig, i) {
    console.log("bbbAPEXFeatureLayer", layerConfig, i);
    let p1;
    if (layerConfig.customParameters && layerConfig.customParameters.locationType) {
        p1 = layerConfig.customParameters.locationType;
    }
    let c = {
        p_flow_id: $("#pFlowId").val(),
        p_flow_step_id: $("#pFlowStepId").val(),
        p_instance: $("#pInstance").val(),
        p_request: "APPLICATION_PROCESS=" + layerConfig._bbbAJAXProcess,
        x01: p1,
        x02: "BBB",
        x03: "NONE",
    };
    console.log("Getting DATA from APEX", c);
    $.ajax({ type: "POST", url: "wwv_flow.ajax", data: c, dataType: "json" })
        .done(function (results) {
            if (typeof results === "string") {
                results = JSON.parse(results);
            }
            bbbMap.buildPointLayer(results, i, layerConfig);
        })
        .fail(function (e) {
            console.log("!!!Error Getting Data", e);
        });
};

bbbMap.bbbAJAXPromise = function (n, mapInfo) {
    console.log("BBB AJAX Promise", n, mapInfo);

    let c = {
        p_flow_id: $("#pFlowId").val(),
        p_flow_step_id: $("#pFlowStepId").val(),
        p_instance: $("#pInstance").val(),
        p_request: "APPLICATION_PROCESS=" + n,
        x01: mapInfo,
        x02: "BBB",
        x03: "NONE",
    };
    console.log("Calling AJAX", c);
    return $.ajax({ type: "POST", url: "wwv_flow.ajax", data: c, dataType: "json" });
};
*/
bbbMap.callAJAX = function (n, mapInfo) {
    console.log("Calling AJAX", n);
    return bbbMap.bbbAJAXPromise(n, mapInfo);
};

//bbbMap.configDefaults = {};
bbbMap.mapDefaults = { baseMap: "arcgis-dark-gray" };

bbbMap.viewDefaults = {
    constainer: "map",
    center: [-96.3537, 40.6698],
    zoom: 4,
    opacity: 0.8,
    title: "Map",
    highlightOptions: { color: "#B7AC83" },
    popup: {
        defaultPopupTemplateEnabled: 1,
        dockEnabled: 1,
        dockOptions: {
            buttonEnabled: 0,
            breakpoint: 0,
        },
    },
};

bbbMap.buildMap = function (opt) {
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/widgets/BasemapGallery", "esri/widgets/LayerList", "esri/widgets/Legend", "esri/widgets/Print", "esri/layers/GraphicsLayer", "esri/widgets/Sketch/SketchViewModel", "esri/views/interactive/snapping/SnappingOptions"], function (esriConfig, Map, MapView, BasemapGallery, LayerList, Legend, Print, GraphicsLayer, SketchViewModel, SnappingOptions) {
        console.log("Require complete.  Building Map", opt);
        //  "esri/widgets/Search",
        //Use API and arcgis-dark-gray basemap since no enterprise liscense
        //2,000,000 tile limit/month
        //esriConfig.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";
        esriConfig.apiKey = opt.map.apiKey;
        console.log("Map", opt.map);

        const map = new Map(opt.map);

        map.allLayers.on("change", (e) => {
            if (e.added.length > 0) {
                e.added.forEach((layer) => {
                    console.log("Layer Added ", layer.title);
                    bbbMap.ui.createLogItem(layer.title, "Layer added");
                });
            }
        });

        opt.view.map = map;
        console.log("Map Constructed. View", opt.view);

        let _viewConfig = Object.fromEntries(Object.entries(opt.view).filter(([_, v]) => v !== null));

        _viewConfig = Object.assign({}, bbbMap.viewDefaults, _viewConfig);
        _viewConfig.map = map;
        bbbMap._viewSettings = _viewConfig;

        //const view = new MapView(opt.view);
        console.log("Map Constructed.  Final View Settings", _viewConfig);
        const view = new MapView(_viewConfig);

        console.log("View Constructed", _viewConfig);

        //use css to bump out view.ui.move("zoom", "bottom-right");

        const basemaps = new BasemapGallery({ view: view, container: "basemaps-container" });
        const layerList = new LayerList({ view: view, selectionMode: "single", dragEnabled: true, container: "sublayers-container" });
        const legend = new Legend({ view: view, container: "legend-container" });
        const print = new Print({ view: view, container: "print-container" });
        const sketchLayer = new GraphicsLayer({ title: "Sketch Canvas" });

        map.add(sketchLayer);
        //const sketch = new Sketch({layer: sketchLayer, view: view, container: "sketch-container",defaultCreateOptions: "freehand", visibleElements: {"undoRedoMenu": true, createTools: {point: false, polyline: false}, selectionTools:{"lasso-selection": false,"rectangle-selection": false}}});
        const sketchVM = new SketchViewModel({ layer: sketchLayer, view: view, defaultUpdateOptions: { preserveAspectRatio: true }, snappingOptions: new SnappingOptions({ enabled: true }) });
        /*
             polygonSymbol: {
               type: "simple-fill",
               outline: {width: 0.95, color: [0, 50, 86, 0.75]},
               color: [183, 172, 131, 0.2]
            }
            */
        bbbMap.ui.sketchVM = sketchVM;

        console.log("Widgets Build");

        view.when(function (v) {
            bbbMap.map = map;
            bbbMap.view = view;

            bbbMap.ui.sketchLayer = sketchLayer;

            bbbMap.ui.init();

            bbbMap.buildAllLayers(opt.layers);

            bbbMap.view.on("click", (event) => {
                bbbMap.view.hitTest(event).then((response) => {
                    response.results.forEach(function (result) {
                        console.log("hit test", result.layer.title, result);
                        /*
                           if (result.graphic && result.graphic.layer && result.graphic.layer === layer) {
                              console.log('Weather layer clicked.  create the graphics');
                              addWeatherGraphics(result.graphic);
                           }

                           if (result.graphic && result.graphic.layer && result.graphic.layer === bbbMap.ui.sketchVM.layer && result.graphic.attributes && result.graphic.attributes.weatherShape) {

                              console.log('Weather graphic was clicked.  filter the things');
                              bbbMap.ui.doGraphicFilter();
                              bbbMap.ui.sketchVM.update([result.graphic],{tool: "transform"});
                           }
*/
                    }); //response foreach loop
                }); //hittest
            }); // view click

            /*
            bbbMap.view.on("click", (e) => {
               console.log('Map Click',e.mapPoint);
               bbbMap.view.hitTest(e)
                  .then(function(response){
                     console.log('View Hit Test', response);
                     response.results.forEach(function(r) {
                      //  if (r.type === "graphic") {
                           console.log('xxxGraphic Found', r.graphic , r.graphic.layer, r);
                      //  }

                     });
                  });
            });
*/

            bbbMap.view.on("layerview-create", (e) => {
                let msg = `Layer ${e.layer.title} creation complete with status ${e.layer.loadStatus}`;
                console.log(msg);
                bbbMap.ui.createLogItem(`${e.layer.title} Rendered`, msg);
                bbbMap.ui.doAddLayer(e.layer);
            });
        });
    }); //end require
    //End Map
};

bbbMap.buildAllLayers = function (layers) {
    layers.forEach(function (layer, i) {
        bbbMap.buildLayer(layer, i);
    });
};

bbbMap.buildLayer = function (layer, i) {
    //remove any empty objects
    let _layer = Object.fromEntries(Object.entries(layer).filter(([_, v]) => v !== null));
    let type = _layer._bbbLayerType;
    console.log("Build Layer", type, _layer._bbbLayerType, layer, i);
    if (type === "wms") {
        bbbMap.buildWMSLayer(_layer, i);
    } else if (type === "wfs") {
        bbbMap.buildWFSLayer(_layer, i);
    } else if (type === "mapimage") {
        bbbMap.buildMapImageLayer(_layer, i);
    } else if (type === "geojson") {
        bbbMap.buildGeoJSONLayer(_layer, i);
    } else if (type === "csv") {
        bbbMap.buildCSVLayer(_layer, i);
    } else if (type === "feature") {
        bbbMap.buildFeatureLayer(_layer, i);
    } else if (type === "point") {
        //if (window.location.hostname === "localhost") {
        bbbMap.ajaxFeatureLayer(_layer, i);
        //} // else {
        //bbbMap.bbbAPEXFeatureLayer(_layer, i);
        //}
    }
};

bbbMap.activateLayer = function (activeLayers, sublayer) {
    if (activeLayers.indexOf(sublayer.id) > -1) {
        console.log("Layer visible", sublayer.id, sublayer.title);
        sublayer.visible = true;
    } else {
        sublayer.visible = false;
    }
};

bbbMap.layerLoader = function (layer, i, config) {
    console.log("Layer Loader", layer.title);
    layer.load().then(() => {
        console.log("Layer Added", layer.title, layer);
        let msg = `${layer.type} layer complete with status ${layer.loadStatus}`;
        let activeLayers = null;
        if (layer._bbbLayerSettings && layer._bbbLayerSettings._bbbActiveLayers) {
            activeLayers = layer._bbbLayerSettings._bbbActiveLayers;
        }

        console.log(msg);
        bbbMap.ui.createLogItem(msg);

        if (activeLayers) {
            console.log("Setting Active Layers", activeLayers);
            layer.sublayers.items.forEach(function (sublayer1) {
                bbbMap.activateLayer(activeLayers, sublayer1);

                if (sublayer1.sublayers) {
                    sublayer1.sublayers.items.forEach(function (sublayer2) {
                        bbbMap.activateLayer(activeLayers, sublayer2);
                    });
                }
            });
        }

        if (layer._bbbSmartColor) {
            require(["esri/smartMapping/renderers/type"], function (SmartColor) {
                let p = { layer: layer, view: bbbMap.view, field: layer._bbbSmartColor };
                SmartColor.createRenderer(p).then((r) => {
                    layer.renderer = r.renderer;
                    layer._bbbRendererRestore = r.renderer.clone();
                });
            });
        }

        bbbMap.map.add(layer, i);

        if (["feature", "wfs", "geojson", "csv"].indexOf(layer.type) > -1) {
            //todo store layerview for filtering
            bbbMap.view.whenLayerView(layer).then(function (layerView) {
                layer._bbbLayerView = layerView;
                bbbMap.layerViews.push(layerView);
            });
        }

        //
    });
};

bbbMap.buildCSVLayer = function (opt, i) {
    console.log("Adding CSV Layer", opt);
    require(["esri/layers/CSVLayer"], function (CSVLayer) {
        const layer = new CSVLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.buildMapImageLayer = function (opt, i) {
    console.log("Adding Map Image Layer", opt);
    require(["esri/layers/MapImageLayer"], function (MapImageLayer) {
        const layer = new MapImageLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.buildWMSLayer = function (opt, i) {
    console.log("Adding WMS Layer", opt);
    require(["esri/layers/WMSLayer"], function (WMSLayer) {
        const layer = new WMSLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.buildWFSLayer = function (opt, i) {
    console.log("Adding WFS Layer", opt);
    require(["esri/layers/WFSLayer"], function (WFSLayer) {
        const layer = new WFSLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.buildGeoJSONLayer = function (opt, i) {
    console.log("Adding geoJSON Layer", opt);
    require(["esri/layers/GeoJSONLayer"], function (GeoJSONLayer) {
        const layer = new GeoJSONLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.buildFeatureLayer = function (opt, i) {
    console.log("Adding Feature Layer", opt);
    require(["esri/layers/FeatureLayer"], function (FeatureLayer) {
        const layer = new FeatureLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.ajaxFeatureLayer = async function (opt, i) {
    console.log("ajaxFeatureLayer", opt, i);
    try {
        data = await fetch(opt._bbbAJAX);
        let results = await data.json();
        console.log("ajaxFeatureLayer results", results);
        bbbMap.buildPointLayer(results, i, opt);
    } catch (e) {
        console.log("Failed to get layer features ", e);
    }
    /*
    $.getJSON({ url: opt._bbbAJAX, cache: false })
        .done(function (results) {
            if (typeof results === "string") {
                results = JSON.parse(results);
            }
            bbbMap.buildPointLayer(results, i, opt);
        })
        .fail(function (e) {
            console.log("Failed to get layer features ", e);
        });
        */
};

bbbMap.buildPointLayer = function (pointData, i, opt) {
    console.log("buildPointLayer", pointData);
    //let features = pointData.locations;
    ////"path": "M8,0A6.006,6.006,0,0,0,2,6c0,3.652,5.4,9.587,5.631,9.838a.5.5,0,0,0,.738,0C8.6,15.587,14,9.652,14,6A6.006,6.006,0,0,0,8,0ZM5.25,5A.75.75,0,1,1,6,5.75.75.75,0,0,1,5.25,5ZM10.3,7.727a2.874,2.874,0,0,1-4.6,0,.375.375,0,0,1,.6-.454,2.126,2.126,0,0,0,3.4,0,.375.375,0,0,1,.6.454ZM10,5.75A.75.75,0,1,1,10.75,5,.75.75,0,0,1,10,5.75Z"
    let data = pointData.filter((d) => d.country === "US");
    const features = data.map((d) => {
        return {
            geometry: {
                type: "point",
                longitude: d.longitude,
                latitude: d.latitude,
            },
            attributes: {
                id: d.store_id,
                name: d.name,
                city: d.city,
                country: d.country,
            },
        };
    });
    console.log("Adding feature layer", features, opt, i);

    require(["esri/layers/FeatureLayer"], function (FeatureLayer) {
        opt.source = features;
        const layer = new FeatureLayer(opt);
        bbbMap.layerLoader(layer, i, opt);
    });
};

bbbMap.buildFeatureTable = function (layer, config, container) {
    console.log("Building Feature Layer", layer, config, container);
    require(["esri/widgets/FeatureTable"], function (FeatureTable) {
        const featureTable = new FeatureTable({
            view: bbbMap.view,
            layer: layer,
            container: container,
            multiSortEnabled: true,
        });

        bbbMap.featureTable = featureTable;
    }); //end require
};

//End map functions
//Begin ui functions
//////////////////////////////////init///////////////////////////////////////////////////////
bbbMap.ui.icon = {};
bbbMap.ui.filters = [];
bbbMap.ui.icon.fire = "M12.305 5.020c-0.090-0.089-0.214-0.144-0.351-0.144-0.259 0-0.471 0.196-0.497 0.448l-0 0.002c-0.159 0.992-0.546 1.872-1.105 2.615l0.011-0.015c0.088-0.502 0.138-1.079 0.138-1.669 0-0.008-0-0.016-0-0.023v0.001c0-3.957-4.8-6.1-5-6.193-0.059-0.027-0.128-0.042-0.201-0.042-0.276 0-0.5 0.224-0.5 0.5 0 0.059 0.010 0.116 0.029 0.169l-0.001-0.003c0.209 0.59 0.347 1.273 0.384 1.982l0.001 0.018c-0.166 1.11-0.639 2.088-1.329 2.87l0.005-0.006c-1.070 1.274-1.762 2.897-1.887 4.677l-0.001 0.026c-0.002 0.049-0.002 0.107-0.002 0.165 0 2.393 1.489 4.438 3.59 5.259l0.038 0.013c0.556 0.209 1.2 0.33 1.871 0.33 0.001 0 0.002 0 0.003 0h-0c2.73-0.082 5.038-1.801 5.984-4.204l0.016-0.045c0.326-0.727 0.516-1.576 0.516-2.468 0-1.655-0.652-3.157-1.713-4.265l0.002 0.002zM12.576 11.376c-0.771 2.102-2.754 3.574-5.082 3.574-0.544 0-1.070-0.081-1.565-0.23l0.038 0.010c-1.753-0.695-2.97-2.376-2.97-4.341 0-0.055 0.001-0.111 0.003-0.165l-0 0.008c0.135-1.591 0.76-3.014 1.721-4.142l-0.008 0.010c0.808-0.929 1.35-2.107 1.497-3.406l0.003-0.029c-0.007-0.419-0.055-0.823-0.139-1.213l0.007 0.040c1.3 0.79 3.421 2.437 3.421 4.748 0.005 0.093 0.007 0.202 0.007 0.312 0 1.016-0.23 1.978-0.639 2.838l0.017-0.040c-0.045 0.073-0.071 0.162-0.071 0.257 0 0.276 0.224 0.5 0.5 0.5 0.103 0 0.199-0.031 0.279-0.085l-0.002 0.001c1.234-0.845 2.156-2.066 2.607-3.496l0.013-0.047c0.498 0.795 0.794 1.762 0.794 2.798 0 0.758-0.158 1.48-0.444 2.133l0.013-0.034z";
////////////////////////////////UI Logger//////////////////////////////////////////////////////////
bbbMap.ui.createLogItem = function (title, description) {
    const card = document.createElement("calcite-card");
    const date = new Date();
    const dateString = date.toISOString();

    let cardTitle = document.createElement("div");
    let cardDesc = document.createElement("div");
    cardTitle.slot = "title";
    cardDesc.slot = "subtitle";
    cardTitle.innerHTML = title;
    cardDesc.innerHTML = dateString + "<br>" + description;

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    document.getElementById("log-container").prepend(card);
};
////////////////////////////////Sketch Functions///////////////////////////////////////////////////
bbbMap.ui.resetSketch = function () {
    console.log("Reset Sketch Canvas");
    bbbMap.ui.sketchLayer.removeAll();

    //let layer = bbbMap.map.allLayers.items[3];
    //bbbMap.view.whenLayerView(layer).then(function(layerView){
    bbbMap.layerViews.forEach(function (layerView) {
        console.log("clearing filter from layer view", layerView.layer.title, layerView);
        layerView.filter = null;
        if (layerView.layer.featureEffect !== undefined) {
            layerView.layer.featureEffect = { filter: { geometry: null }, excludedEffect: null };
        }
    });
    //
    if (bbbMap.featureTable) {
        console.log("Resettng table filter geometry");
        bbbMap.featureTable.filterGeometry = null;
    }
};

bbbMap.ui.setDefaultUpdateOptions = function () {
    const aspectRatioSwitch = document.getElementById("aspectRatioSwitch");
    aspectRatioSwitch.checked = bbbMap.ui.sketchVM.defaultUpdateOptions.preserveAspectRatio;

    // event listeners for UI interactions
    aspectRatioSwitch.addEventListener("calciteSwitchChange", (evt) => {
        console.log("Preserve Aspect Ration Changed", evt.target.checked);
        bbbMap.ui.sketchVM.defaultUpdateOptions.preserveAspectRatio = evt.target.checked;
    });
};

bbbMap.ui.setDefaultOption = function (selectElement, value) {
    console.log("Setting default lov value", selectElement, value);
    for (let i = 0; i < selectElement.children.length; i++) {
        let option = selectElement.children[i];
        if (option.value === value) {
            option.selected = true;
        }
    }
};

bbbMap.ui.setDefaultCreateOptions = function () {
    console.log("Setting Default Create Options");
    const modeSelect = document.getElementById("mode-select");

    // set default mode in the select element if defined
    if (bbbMap.ui.sketchVM.defaultCreateOptions.mode) {
        bbbMap.ui.setDefaultOption(modeSelect, bbbMap.ui.sketchVM.defaultCreateOptions.mode);
    }

    // handles mode select changes
    modeSelect.addEventListener("calciteSelectChange", (evt) => {
        console.log("Mode Select", modeSelect.selectedOption.value);
        bbbMap.ui.sketchVM.defaultCreateOptions.mode = modeSelect.selectedOption.value;
    });

    const enableSnappingSwitch = document.getElementById("enableSnappingSwitch");
    enableSnappingSwitch.checked = bbbMap.ui.sketchVM.snappingOptions.enabled;

    // handles mode select changes
    enableSnappingSwitch.addEventListener("calciteSwitchChange", (evt) => {
        console.log("Enable snapping", evt.target.checked);
        bbbMap.ui.sketchVM.snappingOptions.enabled = evt.target.checked;

        if (evt.target.checked) {
            console.log("Maybe add layers to snap here");
        }
    });
};

bbbMap.ui.init = function () {
    //ui click handlers (wait for document to load then attach listeners to calcite)
    //sketch handlers
    // Connecting the calcite actions with their corresponding SketchViewModel tools

    const polygonBtn = document.getElementById("polygonBtn");
    const circleBtn = document.getElementById("circleBtn");
    const rectangleBtn = document.getElementById("rectangleBtn");
    const clearBtn = document.getElementById("clearBtn");
    const selectBtn = document.getElementById("selectBtn");
    bbbMap.ui.setDefaultCreateOptions();
    bbbMap.ui.setDefaultUpdateOptions();

    polygonBtn.onclick = () => {
        bbbMap.ui.sketchVM.create("polygon");
    };

    circleBtn.onclick = () => {
        bbbMap.ui.sketchVM.create("circle");
    };

    rectangleBtn.onclick = () => {
        bbbMap.ui.sketchVM.create("rectangle");
    };

    clearBtn.onclick = () => {
        bbbMap.ui.sketchLayer.removeMany(bbbMap.ui.sketchVM.updateGraphics.items);
        bbbMap.ui.doGraphicFilter();
    };
    selectBtn.onclick = () => {
        bbbMap.ui.sketchVM.cancel();
    };

    /////////////////////////////////INTERACT///////////////////////////////////////
    require(["esri/layers/WFSLayer", "esri/layers/ogc/wfsUtils", "esri/Graphic", "esri/geometry/geometryEngine"], function (WFSLayer, wfsUtils, Graphic, geometryEngine) {
        const interactContainer = document.getElementById("interact-container");
        const loader = document.getElementById("interactLoader");
        const interactLayer = document.getElementById("interactLayer");

        let url;
        interactLayer.addEventListener("calciteSelectChange", (e) => {
            console.log("Interact Changed", e.target.value, e);

            interactContainer.innerHTML = "";

            if (e.target.value) {
                url = e.target.value;
                loader.hidden = false;
                wfsUtils
                    .getCapabilities(url)
                    .then((capabilites) => {
                        console.log("Capabilities", capabilites);
                        loader.hidden = true;
                        bbbMap.ui.wfsCapabilities = capabilites;
                        createLayerList(capabilites.featureTypes);
                    })
                    .catch((e) => {
                        console.log("Error getting interactions", e);
                    });
            }
        });

        function createLayerList(featureTypes) {
            console.log("createLayerList", featureTypes);
            const list = document.createElement("calcite-pick-list");
            list.filterEnabled = true;
            featureTypes.forEach((feature) => {
                const listitem = document.createElement("calcite-pick-list-item");
                listitem.label = feature.title;
                listitem.value = feature.name;
                list.appendChild(listitem);
            });
            interactContainer.appendChild(list);
            loader.active = false; // stop loading
            list.addEventListener("calciteListChange", updateSelectedLayer);
        }

        function updateSelectedLayer(event) {
            console.log("Handling interact layer select", event);
            const layerName = event.detail.keys().next().value;
            console.log("Handling interact layer select", event, bbbMap.ui.wfsCapabilities, layerName);
            // get layer info for the feature type that was clicked
            wfsUtils.getWFSLayerInfo(bbbMap.ui.wfsCapabilities, layerName).then((wfsLayerInfo) => {
                if (bbbMap.ui.interactLayer) {
                    console.log("Destroying current interact layer", bbbMap.ui.interactLayer.title);
                    bbbMap.ui.interactLayer.destroy();
                }

                bbbMap.ui.resetSketch();

                console.log("Layer Info: ", layerName, wfsLayerInfo);
                // create a WFSLayer from the layer info
                const layer = WFSLayer.fromWFSLayerInfo(wfsLayerInfo);

                console.log("Adding interact layer", layerName, layer);

                bbbMap.ui.interactLayer = layer;

                bbbMap.map.add(layer);

                layer.when((layerView) => {
                    console.log("Interact layer ready", layer, layerView);

                    layer.popupEnabled = false;

                    layer.renderer = {
                        type: "simple",
                        symbol: {
                            type: "simple-fill",
                            outline: { color: [170, 160, 160, 0.9] },
                            color: [250, 240, 105, 0.75],
                        },
                    };

                    if (layer.fullExtent) {
                        bbbMap.view.goTo(layer.fullExtent);
                    }

                    //todo

                    bbbMap.view.on("click", (event) => {
                        bbbMap.view.hitTest(event).then((response) => {
                            console.log("Interact Click", response);

                            response.results.forEach(function (result) {
                                if (result.graphic && result.graphic.layer && result.graphic.layer === layer) {
                                    console.log("Weather layer clicked.  create the graphics");
                                    addWeatherGraphics(result.graphic);
                                }

                                if (result.graphic && result.graphic.layer && result.graphic.layer === bbbMap.ui.sketchVM.layer && result.graphic.attributes && result.graphic.attributes.weatherShape) {
                                    console.log("Weather graphic was clicked.  filter the things");
                                    bbbMap.ui.doGraphicFilter();
                                    bbbMap.ui.sketchVM.update([result.graphic], { tool: "transform" });
                                }
                            }); //response foreach loop
                        }); //hittest
                    }); // view click
                }); //layer when

                function addWeatherGraphics(graphic) {
                    console.log("Adding all weather graphics", graphic);
                    //todo better way to decide if we should draw?
                    if (bbbMap.ui.sketchVM.layer.graphics.length === 0) {
                        bbbMap.ui.interactLayer.renderer = {
                            type: "simple",
                            symbol: {
                                type: "simple-fill",
                                outline: { color: [170, 160, 160, 0.0] },
                                color: [250, 240, 105, 0.1],
                            },
                        };
                        let weatherGeom, weatherGraphic, area;
                        graphic.geometry.rings.forEach(function (r, i) {
                            weatherGeom = graphic.geometry.clone();
                            weatherGeom.rings = [];
                            weatherGeom.addRing(r);

                            area = geometryEngine.geodesicArea(weatherGeom, "square-miles");
                            console.log("Area", area);

                            weatherGeom = geometryEngine.buffer(weatherGeom, 5, "miles");

                            weatherGraphic = new Graphic({
                                layer: bbbMap.ui.sketchLayer,
                                geometry: weatherGeom,
                                attributes: { weatherShape: true },
                                symbol: { type: "simple-fill", color: [230, 4, 4, 0.5] },
                            });
                            bbbMap.ui.sketchLayer.add(weatherGraphic);
                        });
                    }
                }
            });
        }
    });

    /////////////////////////////////////////sketch///////////////////////////////////

    document.getElementById("resetSketch").addEventListener("click", (e) => {
        bbbMap.ui.resetSketch();
    });

    document.getElementById("resetInteract").addEventListener("click", (e) => {
        if (bbbMap.ui.interactLayer) {
            bbbMap.ui.interactLayer.destroy();
        }

        bbbMap.ui.resetSketch();
    });

    bbbMap.ui.doGraphicFilter = function (g) {
        let geoms;
        require(["esri/geometry/geometryEngine"], function (geometryEngine) {
            if (bbbMap.ui.sketchLayer.graphics.length > 0) {
                console.log("Graphics found.  Get all geoms");
                geoms = bbbMap.ui.sketchLayer.graphics.items.map(function (graphic) {
                    return graphic.geometry;
                });
            }

            let geom = geometryEngine.union(geoms);
            bbbMap.ui.graphic = geom;

            if (geom) {
                console.log("Graphic has a geometry", geom);
                let diameter = geometryEngine.geodesicLength(geom, "miles");
                let area = geometryEngine.geodesicArea(geom, "square-miles");

                console.log("Diameter and Area", diameter, area);
                document.getElementById("sketchPanel").summary = "Diameter: " + diameter.toFixed(1) + "mi.";

                if (bbbMap.featureTable) {
                    bbbMap.featureTable.filterGeometry = geom;
                }

                bbbMap.layerViews.forEach(function (layerView) {
                    if (layerView.layer.featureEffect !== undefined) {
                        layerView.layer.featureEffect = {
                            filter: {
                                geometry: geom,
                                spatialRelationship: "intersects",
                            },
                            excludedEffect: "grayscale(90%) opacity(25%)",
                            includedEffect: "", //bloom(1.5, 0.5px, 0.1) opacity(90%)
                        };
                    }
                });
            } else {
                bbbMap.ui.resetSketch();
            }
        }); //end require
    };

    bbbMap.ui.sketchVM.on(["create"], (event) => {
        if (event.state === "start") {
            console.log("SketchVM Create Start", event);
            // bbbMap.ui.sketchLayer.removeAll();
        }
        if (event.state === "complete") {
            console.log("SketchVM Create Complete", event);
            bbbMap.ui.doGraphicFilter(event.graphic);
        }
    });

    bbbMap.ui.sketchVM.on(["delete"], (event) => {
        console.log("SketchVM Graphic Deleted", event);
        //bbbMap.ui.resetSketch();
        bbbMap.ui.doGraphicFilter();
    });

    bbbMap.ui.sketchVM.on(["update", "undo", "redo"], (event) => {
        if (event.toolEventInfo && event.toolEventInfo.type && ["rotate-stop", "move-stop", "reshape-stop", "scale-stop"].indexOf(event.toolEventInfo.type) > -1) {
            console.log("SketchVM Shape Updated", event.toolEventInfo.type);
            bbbMap.ui.doGraphicFilter(event.graphics[0].geometry);
        }

        if (event.type === "undo" || event.type === "redo") {
            console.log("SketchVM Shape Updated", event.toolEventInfo.type);
            bbbMap.ui.doGraphicFilter(event.graphics[0].geometry);
        }
    });

    //chart handlers
    document.getElementById("chartLayer").addEventListener("calciteSelectChange", (e) => {
        console.log("Chart Layer Selected", e.target.value);
        let layer = bbbMap.map.findLayerById(document.getElementById("chartLayer").value);
        const chartField = document.getElementById("chartField");
        const chartFieldContainer = document.getElementById("chartFieldLabel");
        let option;

        document.getElementById("chartField").innerHTML = "";
        chartFieldContainer.hidden = true;
        document.getElementById("chart-div").innerHTML = "";

        if (layer) {
            if (layer.fields) {
                console.log("Building chart fields lov", layer.title);

                option = document.createElement("calcite-option");
                option.label = "Select a Field";
                option.value = "";
                chartField.appendChild(option);

                layer.fields.forEach(function (field) {
                    option = document.createElement("calcite-option");
                    option.label = field.alias;
                    option.value = field.name;
                    chartField.appendChild(option);
                });

                chartFieldContainer.hidden = false;
            }
        }
    });

    document.getElementById("chartField").addEventListener("calciteSelectChange", (e) => {
        console.log("chart field changed", e.target.value);
        let layer = bbbMap.map.findLayerById(document.getElementById("chartLayer").value);
        let field = e.target.value;
        let chartDiv = document.getElementById("chart-div");
        document.getElementById("chartBlock").open = true;
        let statisticType = "count";
        if (layer && field && chartDiv) {
            let query = layer.createQuery();
            query.outStatistics = [
                {
                    onStatisticField: field,
                    outStatisticFieldName: statisticType,
                    statisticType: statisticType,
                },
            ];
            query.groupByFieldsForStatistics = [field];

            layer.queryFeatures(query).then(function (response) {
                let f = response;
                console.log("Response from chart query", response.features[0].attributes, response);
                f.features = f.features.sort(function (a, b) {
                    return b.attributes.count - a.attributes.count;
                });
                const container = document.createElement("div");
                container.style.width = "100%";
                container.style.height = "350px";
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                container.appendChild(canvas);

                let chartData = {
                    labels: response.features.map((m) => m.attributes[field]),
                    datasets: [
                        {
                            label: "Chart Data",
                            data: response.features.map((m) => m.attributes[statisticType]),
                        },
                    ],
                };

                const chart = new Chart(ctx, {
                    type: "bar",
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                enabled: true,
                            },
                            legend: {
                                display: true,
                            },
                        },
                    },
                });

                document.getElementById("chart-div").appendChild(container);

                //console.log('Sorted features by count', f);
                /*
                let definition = {};
                definition.type = "bar-horizontal";
                definition.datasets = [{ data: response, orderByFields: "count" }];

                definition.series = [
                    {
                        category: { field: field, label: field },
                        value: { field: "count", label: "Count" },
                    },
                ];

                console.log("Creating chart ", definition);

                let chart = new cedar.Chart("chart-div", definition);

                let h = response.features.length * 30;
                h = Math.max(h, 300);

                document.getElementById("chart-div").style.height = h;
                console.log("Sizing Chart ", h);

                chart.show();
                */
            });
        }
    });
    //Styler styleLayerLOV

    document.getElementById("styleLayerLOV").addEventListener("calciteSelectChange", (e) => {
        let layer = bbbMap.map.findLayerById(document.getElementById("styleLayerLOV").value);
        if (layer) {
            console.log("Style layer selected", e.target.value, layer);
            let r = layer.renderer.clone();
            //console.log('Current Symbol', r, r.symbol);
            if ((r.symbol && r.type === "simple") || r.type === "simple-marker") {
                console.log("use simple renderer settings");
            } else {
                console.log("setup a default simple renderer");
                layer.renderer = {
                    type: "simple", // autocasts as new SimpleRenderer()
                    symbol: {
                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                        size: 6,
                        color: "gray",
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            width: 0.5,
                            color: "white",
                        },
                    },
                };
            }

            //todo replace style anyway?
            //if (r.symbol || r.type === "simple" || r.type === "simple-marker") {
            document.getElementById("iconSize").value = layer.renderer.symbol.size;
            document.getElementById("iconColor").value = layer.renderer.symbol.color.toHex();
            document.getElementById("iconOutlineWidth").value = layer.renderer.symbol.outline.width;
            document.getElementById("iconOutlineColor").value = layer.renderer.symbol.outline.color.toHex();
            //}

            document.getElementById("style").open = true;
        } else {
            document.getElementById("style").open = false;
        }
    });

    document.querySelectorAll("calcite-slider").forEach((p) => {
        p.addEventListener("calciteSliderInput", (e) => {
            let layer = bbbMap.map.findLayerById(document.getElementById("styleLayerLOV").value);
            let renderer = layer.renderer;
            if (renderer.symbol) {
                if (e.target.id === "iconSize") {
                    renderer.symbol.size = e.target.value;
                }

                if (e.target.id === "iconOpacity") {
                    let color = renderer.symbol.color;
                    color.a = e.target.value;

                    renderer.symbol.color = [color.r, color.g, color.b, color.a];
                }
                if (e.target.id === "iconOutlineWidth") {
                    renderer.symbol.outline.width = e.target.value;
                }
            }
        });
    });

    document.querySelectorAll("calcite-input").forEach((p) => {
        p.addEventListener("calciteInputInput", (e) => {
            let layer = bbbMap.map.findLayerById(document.getElementById("styleLayerLOV").value);

            let renderer = layer.renderer;
            if (e.target.id === "iconColor") {
                renderer.symbol.color = e.target.value;
            }
            if (e.target.id === "iconOutlineColor") {
                renderer.symbol.outline.color = e.target.value;
            }
        });
    });

    document.getElementById("resetStyle").addEventListener("click", (e) => {
        let layer = bbbMap.map.findLayerById(document.getElementById("styleLayerLOV").value);

        console.log("Reset Style", e, layer);
        if (layer && layer._bbbRendererRestore) {
            layer.renderer = layer._bbbRendererRestore;
        }

        document.getElementById("styleLayerLOV").value = "";
        document.getElementById("style").open = false;
    });

    //Reorder Layers

    document.getElementById("layers-container-list").addEventListener("calciteListOrderChange", (e) => {
        console.log("Reording Layers", e);
        e.detail.forEach(function (layerId, i) {
            bbbMap.map.reorder(bbbMap.map.findLayerById(layerId), i);
        });
    });

    //Add layer button

    document.getElementById("addLayerBtn").addEventListener("click", (e) => {
        console.log("Saving new layer ", e);
        document.getElementById;
        let type = document.getElementById("#addWebServiceType").value;
        let title = document.getElementById("#addWebServiceTitle").value;
        let url = document.getElementById("#addWebServiceURL").value;

        if (type === "csv") {
            console.log("Converting URL to CSV BLOB");
            const blob = new Blob([url], { type: "plain/text" });
            url = URL.createObjectURL(blob);
        }

        bbbMap.buildLayer({ url: url, title: title, _bbbLayerType: type });
        document.getElementById("add-new-layer-modal").open = false;
    });
    //Reset FIlters

    document.getElementById("resetFilters").addEventListener("click", (e) => {
        console.log("Clearing Filters", e);
        document.querySelectorAll("calcite-combobox.bbb-map-filter-list calcite-combobox-item").forEach((cvl) => {
            cvl.selected = false;
        });
    });

    //todo All panel action bar buttons
    document.querySelectorAll("calcite-action-bar").forEach((p) => {
        p.addEventListener("click", (e) => {
            console.log("Button clicked", e.target.tagName, e.target.dataset.actionId, e);
            if (e.target.tagName === "CALCITE-ACTION") {
                //Updated Actions for v1.03
                bbbMap.nextPanel = e.target.dataset.actionId;
                console.log("Active", bbbMap.activePanel, "Next", bbbMap.nextPanel);
                if (bbbMap.nextPanel && bbbMap.nextPanel !== bbbMap.activePanel) {
                    if (bbbMap.activePanel) {
                        document.querySelector(`[data-action-id=${bbbMap.activePanel}]`).active = false;
                        document.querySelector(`[data-panel-id=${bbbMap.activePanel}]`).closed = true;
                    }

                    document.querySelector(`[data-action-id=${bbbMap.nextPanel}]`).active = true;
                    document.querySelector(`[data-panel-id=${bbbMap.nextPanel}]`).closed = false;
                    bbbMap.activePanel = bbbMap.nextPanel;
                }

                //Modal Layer
                bbbMap.modalPanel = e.target.dataset.modalId;

                if (bbbMap.modalPanel) {
                    console.log("Modal Panel", bbbMap.modalPanel);
                    document.getElementById(bbbMap.modalPanel).open = true;
                }

                //Handle Close Table
                if (e.target.id === "close-table") {
                    console.log("Closing Feature Table and Re-sizing Map");
                    if (bbbMap.featureTable) {
                        bbbMap.featureTable.destroy();
                        bbbMap.featureTable = "";
                    }

                    bbbMap.view.container.style.height = "100%";
                    e.target.hidden = true;
                }
            }
        });
    });

    document.querySelectorAll("calcite-panel").forEach((p) => {
        p.addEventListener("calcitePanelClose", (e) => {
            console.log("Panel Dismissed", e.target.heading);
            let btn = document.querySelector(`[data-action-id=${e.target.dataset.panelId}]`);
            bbbMap.activePanel = "";

            if (btn) {
                btn.active = !e.target.closed;
            }
        });
    });
};
//end ui
/////////////////////////////////end init/////////////////////////////////////////////////////
bbbMap.ui.doAddLayer = function (layer) {
    if (["feature", "wms", "vector-tile", "geojson", "csv", "map-image"].indexOf(layer.type) > -1) {
        console.log("Adding UI components for layer ", layer.type, layer.title, layer);
        bbbMap.ui.buildLayerInfo(layer);
        bbbMap.ui.buildFilters(layer);
        bbbMap.ui.buildStyler(layer);
        bbbMap.ui.buildChart(layer);
        bbbMap.ui.buildInteract(layer);
    }
};

bbbMap.ui.buildInteract = function (layer) {
    console.log("Building interact layer lov", layer);
};

////////////////////////////////Charts///////////////////////////////////////////////////
bbbMap.ui.buildChart = function (layer) {
    if (layer.fields) {
        console.log("Building chart layer lov", layer.title);
        const chartLayerContainer = document.getElementById("chartLayer");
        let option = document.createElement("calcite-option");
        option.label = layer.title;
        option.value = layer.id;
        chartLayerContainer.appendChild(option);
    }
};

//end Charts
/////////////////////////////////Styler///////////////////////////////////////////////////
//styleLayerLOV
bbbMap.ui.buildStyler = function (layer) {
    if (layer.renderer) {
        console.log("Building Styler for layer", layer.title, layer.renderer);
        layer._bbbRendererRestore = layer.renderer.clone();

        const styleContainer = document.getElementById("styleLayerLOV");
        let option = document.createElement("calcite-option");
        option.label = layer.title;
        option.value = layer.id;

        styleContainer.appendChild(option);
    }
};
/////////////////////////////////FILTERS//////////////////////////////////////////////////
bbbMap.ui.applyFilters = function (layer) {
    console.log("Applying filter", layer.id, bbbMap.ui.filters);

    let expr = " 1=1 ",
        fv = "";

    bbbMap.ui.filters.forEach(function (filterItem) {
        fv = "";
        if (filterItem.layerId === layer.id) {
            if (filterItem.selected.length !== 0) {
                //decide datatype

                let fieldDataType = layer.fields.find((e) => e.name === filterItem.filterName);
                console.log("Decide datatype for expression", filterItem.filterName, fieldDataType.type, layer.fields);
                filterItem.selected.forEach(function (val) {
                    if (fieldDataType.type == "string") {
                        fv += `,'${val}'`;
                    } else {
                        fv += `,${val}`;
                    }
                });

                fv = fv.replace(/^,|,$/g, "");
                expr += ` AND ${filterItem.filterName} in (${fv})`;
            }
        }
    });

    console.log(`definitionExpression for ${layer.title} = ${expr}`);
    layer.definitionExpression = expr;

    if (document.getElementById("zoomToFilterResults").checked) {
        layer.queryExtent().then((r) => {
            bbbMap.view.goTo(r);
        });
    }
};

bbbMap.ui.filterChangeHandler = function (layer, filterName, e) {
    console.log("Handle Filter Change", filterName, e, layer);

    bbbMap.ui.filters.forEach(function (f) {
        if (f.filterName === filterName) {
            f.selected = e.target.selectedItems.map(function (item) {
                return item.value;
            });
        }
    });

    bbbMap.ui.applyFilters(layer);
};

bbbMap.ui.buildLayerFilterListItem = function (layer, filterItem) {
    console.log("Building List Item ", filterItem, layer);
    const label = document.createElement("calcite-label");
    const comboBox = document.createElement("calcite-combobox");

    label.textContent = `${layer.title}: ${filterItem.label}`;
    label.scale = "s";

    comboBox.id = filterItem.filterName;
    comboBox.placeholder = `Search ${filterItem.label}`;
    comboBox.scale = "s";
    comboBox.className = "bbb-map-filter-list";

    comboBox.addEventListener("calciteComboboxChange", (e) => bbbMap.ui.filterChangeHandler(layer, filterItem.filterName, e));

    filterItem.uniqValues.forEach(function (v) {
        let comboBoxItem = document.createElement("calcite-combobox-item");
        comboBoxItem.textLabel = v;
        comboBoxItem.value = v;

        comboBox.appendChild(comboBoxItem);
    });

    label.appendChild(comboBox);

    document.getElementById("filters-container").appendChild(label);
};

bbbMap.ui.buildFilters = function (layer) {
    console.log("Build Filters for Layer ", layer);
    let filterItem = {};

    if (layer._bbbFilterFields && layer.fields) {
        layer._bbbFilterFields.forEach(function (filterField) {
            console.log("Found filter ", filterField);
            let field = layer.fields.find((e) => e.name === filterField);

            if (field) {
                let query = layer.createQuery();
                query.where = "1=1";
                query.outFields = [filterField];

                layer.queryFeatures(query).then(function (response) {
                    let uniqValues = [...new Set(response.features.map((feature) => feature.attributes[filterField]))];

                    filterItem = { layerId: layer.id, filterName: filterField, label: field.alias, selected: [], uniqValues: uniqValues };
                    bbbMap.ui.filters.push(filterItem);
                    bbbMap.ui.buildLayerFilterListItem(layer, filterItem);
                });
            }
        });
    }
};

///////////////////////////////// LAYER INFO //////////////////////////////////////////////////
bbbMap.ui.btnHandler = function (layer, e) {
    console.log("Plus button clicked.  Build feature table");
    const divName = "featureTableDiv";
    const containerDiv = document.getElementById("featureTableContainer");
    let featureTableDiv = document.getElementById(divName);

    if (featureTableDiv) {
        console.log("Feature Table was already created.  Destroy it. ");
        if (bbbMap.featureTable) {
            bbbMap.featureTable.destroy();
        }
    }

    if (containerDiv) {
        console.log("Container is avialable build featureTable there", containerDiv, layer.type);
        if (["feature", "geojson", "csv"].indexOf(layer.type) > -1) {
            featureTableDiv = document.createElement("div");
            featureTableDiv.id = divName;
            let closeBtn = document.getElementById("close-table");
            if (closeBtn) {
                closeBtn.hidden = false;
            }

            bbbMap.buildFeatureTable(layer, {}, featureTableDiv);
            containerDiv.appendChild(featureTableDiv);
            bbbMap.view.container.style.height = "60%";
            containerDiv.style.height = "40%";
        }
    }
};

bbbMap.ui.buildLayerInfo = function (layer) {
    if (["feature", "wms", "geojson", "csv", "map-image"].indexOf(layer.type) > -1) {
        console.log("Adding Layer Info, feature table option and info");
        //const li = document.createElement("calcite-value-list-item");
        const li = document.createElement("calcite-list-item");
        const action = document.createElement("calcite-action");
        //const btn = document.createElement("calcite-value-list-item");
        //layers-container-list
        li.label = layer.title;
        li.value = layer.id;

        action.slot = "actions-end";
        action.scale = "m";
        action.icon = "plus";
        //action.id=
        action.addEventListener("click", (e) => bbbMap.ui.btnHandler(layer, e));

        li.appendChild(action);
        document.getElementById("layers-container-list").appendChild(li);
    }
    /////////////////////////////////LAYER INFO END//////////////////////////////////////////////////
};

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Ready");
    //document.getElementById("wwvFlowForm").onsubmit = function () {
    //return false;
    //};
    try {
        config = await fetch("mapConfig.json");
        let jsonConfig = await config.json();
        console.log(jsonConfig);
        bbbMap.ready(jsonConfig);
    } catch (e) {
        bbbMap.catch(e);
    }

    //Promise.all([$.getJSON({ url: "mapConfig.json", cache: false })])
    //Promise.all([fetch("mapConfig.json")])
    //.then(bbbMap.ready)
    //.catch(bbbMap.catch);
});
