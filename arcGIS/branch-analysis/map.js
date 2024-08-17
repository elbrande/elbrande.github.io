const bbbMap = {};
bbbMap.versionNumber = "2.1.1.0";
bbbMap.ui = {};
bbbMap.featureTables = [];
bbbMap._config = {};
bbbMap.banks = [];

bbbMap.sanitizeInputs = (i) => {
    return String(i)
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();
};

bbbMap.getDataSourceConfig = () => {
    bbbMap._config.data = {};
    bbbMap.bankService = "https://banks.data.fdic.gov/api/institutions?fields=ZIP,ADDRESS,%2COFFDOM%2CCITY%2CCOUNTY%2CSTNAME%2CSTALP%2CNAME%2CACTIVE%2CCERT%2CCBSA%2CASSET%2CNETINC%2CDEP%2CDEPDOM%2CROE%2CROA%2CDATEUPDT%2COFFICES&sort_by=NAME&sort_order=DESC&limit=100&offset=0&format=json&download=false&filename=data_file";
    bbbMap.branchService = "https://banks.data.fdic.gov/api/locations?fields=CERT,ADDRESS,LATITUDE,LONGITUDE,NAME,OFFNAME%2CUNINUM%2CSERVTYPE%2CRUNDATE%2CCITY%2CSTNAME%2CZIP%2CCOUNTY&sort_by=NAME&sort_order=DESC&limit=5000&offset=0&format=json&download=false&filename=data_file";
    bbbMap.censusTractService = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Total_Population_Boundaries/FeatureServer/2";
    bbbMap.nearbyBranchService = "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/FDIC_InsuredBanks/FeatureServer/0";
    bbbMap.branchService = "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/FDIC_InsuredBanks/FeatureServer/0";
    //https://livingatlas.arcgis.com/en/browse/?q=acs%20current#q=acs+current&d=2
    //https://hifld-geoplatform.opendata.arcgis.com/datasets/geoplatform::fdic-insured-banks/explore
};
//https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/FDIC_InsuredBanks/FeatureServer/0/
//https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/FDIC_InsuredBanks/FeatureServer/0"
bbbMap.getLayerConfig = () => {
    bbbMap._config.layers = [];

    bbbMap.branchSearchID = "branchSearch";
    bbbMap.censusTractID = "censusTracts";
    bbbMap.nearbyBranchesID = "nearbyBranches";

    //bbbMap._config.layers.push ({layerId: 1, id:"branchSearch", title:"Branch Locations",objectIdField:["*"],popupEnabled: 1, renderer: {type: "simple", symbol: { type: "simple-fill", outline: {color: [170, 160, 160, 0.90]}, color: [250, 240, 105, 0.75] }}, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1});
    bbbMap._config.layers.push({ layerId: 1, id: bbbMap.branchSearchID, title: "Branch Locations", objectIdField: "OBJECTID", outFields: ["*"], popupEnabled: 1, renderer: { type: "simple", symbol: { type: "simple-marker", size: 8, color: [56, 182, 255, 0.55], outline: { width: 0, color: "white" } } }, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1 });
    bbbMap._config.layers.push({ layerId: 2, id: bbbMap.nearbyBranchesID, title: "Nearby Branches", objectIdField: "OBJECTID", outFields: ["*"], popupEnabled: 1, renderer: { type: "simple", symbol: { type: "simple-marker", size: 8, color: [102, 204, 102, 0.55], outline: { width: 0, color: "white" } } }, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1 });
    bbbMap._config.layers.push({ layerId: 0, id: bbbMap.censusTractID, title: "Census Tracts", objectIdField: "OBJECTID", outFields: ["*"], popupEnabled: 1, legendEnabled: 1, visible: 1, renderer: { type: "simple", symbol: { type: "simple-fill", outline: { width: 0.5, color: [250, 255, 255, 0.5] }, color: [20, 130, 200, 0.35] } } });
};

bbbMap.init = () => {
    console.log("bbbMap.init");
    bbbMap.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";
    bbbMap.goToOptions = { animate: true, animationMode: "auto", duration: 1000, maxDuration: 2000, easing: "ease" };
    bbbMap.getDataSourceConfig();
    bbbMap.getLayerConfig();
    bbbMap.initMap();
    bbbMap.ui.init();
};

bbbMap.initMap = () => {
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/FeatureTable", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/widgets/BasemapGallery", "esri/widgets/LayerList", "esri/widgets/Legend", "esri/widgets/Print", "esri/widgets/Search", "esri/core/reactiveUtils", "esri/geometry/geometryEngine", "esri/geometry/support/webMercatorUtils"], (esriConfig, Map, MapView, FeatureLayer, FeatureTable, GraphicsLayer, Graphic, BasemapGallery, LayerList, Legend, Print, Search, reactiveUtils, geometryEngine, webMercatorUtils) =>
        (async () => {
            esriConfig.apiKey = bbbMap.apiKey;

            bbbMap.esri = {};
            bbbMap.esri.geometryEngine = geometryEngine;
            bbbMap.esri.reactiveUtils = reactiveUtils;
            bbbMap.esri.webMercatorUtils = webMercatorUtils;
            bbbMap.esri.FeatureLayer = FeatureLayer;
            bbbMap.esri.FeatureTable = FeatureTable;
            bbbMap.esri.Graphic = Graphic;

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
                    dockEnabled: 1,
                    dockOptions: {
                        buttonEnabled: 0,
                        breakpoint: 0,
                    },
                },
                container: "map",
            });

            let darkMode = localStorage.getItem("darkMode") === "false" ? false : true;
            bbbMap.ui.setMode(darkMode);

            bbbMap.layerListWidget = new LayerList({ view: bbbMap.view, dragEnabled: true, container: "sublayers-container" });
            bbbMap.basemapGallaryWidget = new BasemapGallery({ view: bbbMap.view, container: "basemaps-container" });
            bbbMap.legendWidget = new Legend({ view: bbbMap.view, container: "legend-container" });
            bbbMap.printWidget = new Print({ view: bbbMap.view, container: "print-container" });

            bbbMap.censusTractReferenceLayer = new FeatureLayer({ id: "censusTractService", url: bbbMap.censusTractService });
            bbbMap.branchReferenceLayer = new FeatureLayer({ id: "branchService", url: bbbMap.branchService });

            bbbMap.bufferGraphicsLayer = new GraphicsLayer({ id: "bufferGraphicsLayer", popupEnabled: 1, title: "Buffered Search" });
            bbbMap.map.add(bbbMap.bufferGraphicsLayer);

            bbbMap.searchWidget = new Search({ view: bbbMap.view, id: "searchWidget" });

            //filter featureTable by view extent
            reactiveUtils.when(
                () => bbbMap.view.stationary,
                () => {
                    console.log("View is stationary.  Filter featureTable by extent");
                    if (bbbMap.tablesZoom) {
                        bbbMap.featureTables.forEach((table) => (table.filterGeometry = bbbMap.view.extent));
                    }
                },
                { initial: true }
            );

            //listen for popup clicks
            reactiveUtils.on(
                () => bbbMap.view.popup,
                "trigger-action",
                (e) => {
                    console.log("reactiveUtils.on listening for popup", e, bbbMap.view.popup.selectedFeature);
                    if (e.action.id === "find-nearby-branches") {
                        console.log("Popup Call: find-nearby-branches");
                        bbbMap.getNearbyBranches(bbbMap.view.popup.selectedFeature, bbbMap._bufferSize);
                    } else if (e.action.id === "find-nearby-tracts") {
                        console.log("Popup Call: find-nearby-tracts");
                        bbbMap.getNearbyTracts(bbbMap.view.popup.selectedFeature, bbbMap._bufferSize);
                    } else if (e.action.id === "google-maps") {
                        console.log("Popup Call: google-maps");
                        let lat, lng;
                        if (bbbMap.view.popup.selectedFeature.geometry.type === "point") {
                            lat = bbbMap.view.popup.selectedFeature.geometry.latitude;
                            lng = bbbMap.view.popup.selectedFeature.geometry.longitude;
                        } else {
                            lat = bbbMap.view.popup.selectedFeature.geometry.centroid.latitude;
                            lng = bbbMap.view.popup.selectedFeature.geometry.centroid.longitude;
                        }
                        console.log("Opening google", lat, lng);
                        window.open(`https://www.google.com/maps/search/?api1&query=${lat},${lng}`, "_blank");
                    }
                }
            );

            //popup feature changed
            reactiveUtils.when(
                () => bbbMap.view.popup.selectedFeature,
                (feature) => {
                    console.log("Popup feature change", feature);
                    bbbMap.view.popup.actions = [];

                    //if (feature.geometry.type === 'point) {
                    bbbMap.view.popup.actions.push({ title: "Nearby Branches", id: "find-nearby-branches", icon: "measure" });
                    bbbMap.view.popup.actions.push({ title: "Nearby Census Tracts", id: "find-nearby-tracts", icon: "polygon-area" });
                    bbbMap.view.popup.actions.push({ title: "Google Maps", id: "google-maps", icon: "pin-tear" });
                    //}
                }
            );

            //view is ready
            bbbMap.view.when((view) => {
                console.log("Map.view created", view);
                bbbMap.view.padding = { left: 45 };
            });
        })()); //end require
};

bbbMap.ui.init = () => {
    console.log("ui.init");

    bbbMap.formats = {};
    bbbMap.formats.USDollar = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    bbbMap._bufferSize = 1.2;

    bbbMap.tablesZoom = true;
    bbbMap.tablesShow = true;

    bbbMap.appContainer = document.getElementById("mapContainer");
    bbbMap.featureTableContainer = document.getElementById("featureTableContainer");
    bbbMap.analyzeBranchContainer = document.getElementById("analyzeBranchContainer");
    bbbMap.analyzeBranchCardContent = document.getElementById("analyzeBranchCardContent");

    bbbMap.ui.censusTractsNotice = document.getElementById("censusTractsNotice");
    bbbMap.ui.censusTractsNoticeContent = document.getElementById("censusTractsNoticeContent");
    bbbMap.ui.nearbyBranchesNotice = document.getElementById("nearbyBranchesNotice");
    bbbMap.ui.nearbyBranchesNoticeContent = document.getElementById("nearbyBranchesNoticeContent");

    bbbMap.censusScrim = document.getElementById("censusScrim");
    bbbMap.nearbyBranchesScrim = document.getElementById("nearbyBranchesScrim");

    //search
    bbbMap.ui.bankSearchModal = document.getElementById("bankSearchModal");
    bbbMap.ui.bankSearchModalTitle = document.getElementById("bankSearchModalTitle");
    bbbMap.ui.bankNumberRecords = document.getElementById("bankNumberRecords");

    bbbMap.ui.initalSearchNotice = document.getElementById("initalSearchNotice");
    bbbMap.ui.searchResultsNotice = document.getElementById("searchResultsNotice");
    bbbMap.ui.searchResultsNoticeContent = document.getElementById("searchResultsNoticeContent");

    bbbMap.ui.bankSearchPagination = document.getElementById("bankSearchPagination");
    bbbMap.ui.bankSearchContent = document.getElementById("bankSearchContent");
    bbbMap.ui.bankSearchContentNotice = document.getElementById("bankSearchContentNotice");
    bbbMap.ui.bankSearchCardContainer = document.getElementById("bankSearchCardContainer");

    bbbMap.ui.bankSearchBtn = document.getElementById("bankSearchBtn");
    bbbMap.ui.bankSearchCert = document.getElementById("bankSearchCert");
    bbbMap.ui.bankSearchName = document.getElementById("bankSearchName");
    bbbMap.ui.initSearch();
    //end search setup
    bbbMap.showFeatureContainer(false);

    //handle sliders
    bbbMap.ui.nearbyBranchThresholdSlider = document.getElementById("nearbyBranchThresholdSlider");
    bbbMap.ui.censusTractsThresholdSlider = document.getElementById("censusTractsThresholdSlider");

    bbbMap.ui.nearbyBranchThresholdSlider.addEventListener("calciteSliderChange", (e) => {
        console.log("nearbyBranchThresholdSlider change", e);
        bbbMap._bufferSize = e.target.value;
        bbbMap.ui.censusTractsThresholdSlider.value = bbbMap._bufferSize;

        bbbMap.getNearbyBranches(null, bbbMap._bufferSize);
    });

    //handle sliders

    bbbMap.ui.censusTractsThresholdSlider.addEventListener("calciteSliderChange", (e) => {
        console.log("censusTractsThresholdSlider change", e);
        bbbMap._bufferSize = e.target.value;
        bbbMap.ui.nearbyBranchThresholdSlider.value = bbbMap._bufferSize;

        bbbMap.getNearbyTracts(null, bbbMap._bufferSize);
    });

    //Handle calite panels and action
    document.querySelector("calcite-action-bar").addEventListener("click", (e) => {
        console.log("Calcite Action clicked", e.target.tagName, e);
        if (e.target.tagName === "CALCITE-ACTION") {
            bbbMap.ui.openPanel(e.target.dataset.actionId);
        }
    });

    document.querySelectorAll("calcite-panel").forEach((p) => {
        p.addEventListener("calcitePanelClose", (e) => {
            bbbMap.ui.closePanel(e.target.dataset.panelId);
        });
    });

    bbbMap.ui.openPanel(bbbMap.branchSearchID);

    //hide|show feature tables
    document.getElementById("featureLayerToggle").addEventListener("calciteSwitchChange", (e) => {
        console.log("featureLayerToggle clicked", e.target.tagName, e);
        bbbMap.tablesShow = document.getElementById("featureLayerToggle").checked;
        bbbMap.showFeatureContainer(bbbMap.tablesShow);
    });

    //hide|show feature tables
    document.getElementById("featureLayerZoomToggle").addEventListener("calciteSwitchChange", (e) => {
        console.log("featureLayerZoomToggle clicked", e.target.tagName, e);
        bbbMap.tablesZoom = document.getElementById("featureLayerZoomToggle").checked;
    });

    document.getElementById("darkModeToggle").addEventListener("calciteSwitchChange", (e) => {
        console.log("darkModeToggle clicked", e.target.tagName, e);
        /* document.body.classList.toggle("calcite-mode-dark");
          // ArcGIS Maps SDK theme
          const dark = document.getElementById("theme-dark");
          const light = document.getElementById("theme-light");
          dark.disabled = !dark.disabled;
          light.disabled = !light.disabled;
          // ArcGIS Maps SDK basemap
          bbbMap.map.basemap = dark.disabled ? "gray-vector" : "dark-gray-vector";   
          */
        localStorage.setItem("darkMode", e.target.checked);
        bbbMap.ui.setMode(e.target.checked);
    });

    //resize map and table based on action bar
    document.addEventListener("calciteActionBarToggle", (e) => {
        console.log("calciteActionBarToggle", e);
        bbbMap.ui.actionBarExpanded = !bbbMap.ui.actionBarExpanded;
        bbbMap.view.padding = { left: bbbMap.ui.actionBarExpanded ? 155 : 45 };
        document.getElementById("featureTableContainer").style.marginLeft = bbbMap.ui.actionBarExpanded ? "170px" : "50px";
    });

    //reopen search result modal
    bbbMap.ui.searchResultsNotice.addEventListener("click", ({ target }) => {
        console.log("Clicking Search Results", target);
        let cnt = parseInt(bbbMap.ui.searchResultsNotice.dataset.bankCnt, 10);
        if (cnt) {
            bbbMap.ui.bankSearchModal.open = true;
        }
    });

    //handle pagination
    bbbMap.ui.bankSearchPagination.addEventListener("calcitePaginationChange", ({ target }) => {
        console.log("calcitePaginationChange", bbbMap.banks, target.startItem, target.pageSize);
        let paginatedBanks = bbbMap.banks.slice(target.startItem - 1, target.startItem - 1 + target.pageSize);

        console.log("paginatedBanks", paginatedBanks);

        bbbMap.ui.bankSearchCardContainer.innerHTML = "";
        paginatedBanks.forEach((bank) => bbbMap.ui.createBankSearchCard(bank));
    });
};

bbbMap.ui.setMode = function (darkMode = true) {
    console.log("setMode.  darkMode", darkMode);

    const dark = document.getElementById("theme-dark");
    const light = document.getElementById("theme-light");
    if (darkMode) {
        document.body.classList.add("calcite-mode-dark");
        dark.disabled = false;
        light.disabled = true;
        bbbMap.map.basemap = "dark-gray-vector";
    } else {
        document.body.classList.remove("calcite-mode-dark");
        dark.disabled = true;
        light.disabled = false;
        bbbMap.map.basemap = "gray-vector";
    }

    document.getElementById("darkModeToggle").checked = darkMode;
};

bbbMap.ui.initSearch = () => {
    console.log("initSearch");

    bbbMap.ui.bankSearchBtn.addEventListener("click", async (e) => {
        console.log("Bank Search Button clicked", e);
        let bankURL = bbbMap.bankService,
            cert = bbbMap.sanitizeInputs(bbbMap.ui.bankSearchCert.value),
            bankName = bbbMap.sanitizeInputs(bbbMap.ui.bankSearchName.value);
        console.log("cert", cert, "bank", bankName);

        let inputPass = 1,
            msg = "";
        if (cert.length === 0 && bankName.length === 0) {
            msg = `Please enter a value for cert or bank name`;
            inputPass = false;
        } else if (cert.length < 1 && bankName < 3) {
            msg = `Please try a longer name ${bankName} will return too many results.`;
            inputPass = false;
        }

        if (!inputPass) {
            bbbMap.ui.searchResultsNoticeContent.innerHTML = msg;
            bbbMap.ui.searchResultsNotice.kind = "danger";
            bbbMap.ui.searchResultsNotice.icon = "exclamation-mark-triangle";

            bbbMap.ui.initalSearchNotice.removeAttribute("open");
            bbbMap.ui.searchResultsNotice.setAttribute("open", true);
        } else {
            if (cert.length > 0) {
                bankURL += `&filters=CERT:${cert}`;
            } else {
                bankURL += `&filters=ACTIVE:1&search=NAME:${bankName}`;
            }

            let banks = await fetch(bankURL);
            banks = await banks.json();
            banks = banks.data.map((m) => m.data);
            bbbMap.ui.doBankSearch(banks);
        }
    });
};

bbbMap.ui.doBankSearch = (banks) => {
    console.log("doBankSearch", banks);

    bbbMap.banks = banks;
    bbbMap.ui.bankSearchCardContainer.innerHTML = "";

    bbbMap.ui.searchResultsNoticeContent.innerHTML = `${banks.length} banks found`;
    bbbMap.ui.bankSearchModalTitle.innerHTML = `Select a bank (${banks.length} found)`;
    bbbMap.ui.searchResultsNotice.dataset.bankCnt = banks.length;

    bbbMap.ui.searchResultsNotice.kind = "success";
    bbbMap.ui.searchResultsNotice.icon = "check-circle";

    if (banks.length === 0) {
        console.log("no banks found");

        bbbMap.ui.searchResultsNoticeContent.innerHTML = `Sorry, no bank(s) found.  Please try again.`;
        bbbMap.ui.searchResultsNotice.kind = "danger";
        bbbMap.ui.searchResultsNotice.icon = "exclamation-mark-triangle";
    } else if (banks.length === 1) {
        bbbMap.ui.searchResultsNoticeContent.innerHTML = `${banks[0].NAME} found.`;

        bbbMap.bankName = banks[0].NAME;
        bbbMap.cert = banks[0].CERT;

        //just once, so get the branches and save everyone the extra click
        bbbMap.getBranches(bbbMap.cert);
    } else {
        bbbMap.ui.bankNumberRecords.innerHTML = `${banks.length} banks found`;
        bbbMap.ui.bankSearchPagination.startItem = 1;
        bbbMap.ui.bankSearchPagination.totalItems = banks.length;
        bbbMap.ui.bankSearchPagination.style.visibility = "hidden";

        if (bbbMap.ui.bankSearchPagination.totalItems > bbbMap.ui.bankSearchPagination.pageSize) {
            bbbMap.ui.bankSearchPagination.style.visibility = "visible";
        }
        console.log("paginated search results");
        banks.forEach((bank) => bbbMap.ui.createBankSearchCard(bank));
    }

    bbbMap.ui.initalSearchNotice.removeAttribute("open");

    bbbMap.ui.searchResultsNotice.setAttribute("open", true);
};

bbbMap.ui.createBankSearchCard = (item) => {
    if (bbbMap.ui.bankSearchCardContainer.childElementCount < bbbMap.ui.bankSearchPagination.pageSize) {
        console.log("createBankSearchCard", bbbMap.ui.bankSearchCardContainer.childElementCount, bbbMap.ui.bankSearchPagination.pageSize, item);

        let searchCard = document.createElement("calcite-card");
        searchCard.innerHTML = `<b>${item.NAME} (${item.CERT}) </b><br>${item.ADDRESS}<br>Domestic Offices: ${item.OFFDOM}`;
        searchCard.thumbnailPosition = "inline-start";

        let searchBtn = document.createElement("calcite-button");
        searchBtn.innerHTML = `Open ${item.CERT}`;
        searchBtn.innerStart = "launch";
        searchBtn.slot = "footer-end";
        searchBtn.width = "full";

        searchBtn.onclick = (e) => {
            console.log("searchBtn.onclick", e);
            bbbMap.bankName = item.NAME;
            bbbMap.cert = item.CERT;

            bbbMap.getBranches(bbbMap.cert);
        };

        searchCard.appendChild(searchBtn);
        bbbMap.ui.bankSearchCardContainer.appendChild(searchCard);
        bbbMap.ui.bankSearchModal.open = true;
    }
};

bbbMap.getBranches = async (cert) => {
    console.log("getBranches", cert);
    bbbMap.ui.closePanel(bbbMap.branchSearchID);
    bbbMap.ui.bankSearchModal.open = false;
    //where: `CERT=${cert}`,
    let getBranchesQuery = {
        where: `CERT=${cert}`,
        outFields: bbbMap.branchFields,
        returnGeometry: true,
    };
    //['CERT','NAMEFULL','BRNUM','UNINUMBR','NAMEBR','ADDRESBR','GEOCODE_CENSUS_TRACT','STATUS','SCORE','REPDTE'],
    //bbbMap.branchFields
    console.log("getBranches Query", getBranchesQuery);

    const results = await bbbMap.branchReferenceLayer.queryFeatures(getBranchesQuery);
    console.log("getBranches results", results);
    bbbMap.showBranches(results);

    /*let branches = await fetch(bbbMap.branchService + `&filters=CERT:${cert}`);
    branches = await branches.json();
    branches = branches.data.map(m => m.data);
    bbbMap.showBranches(branches);
    */
};

bbbMap.showBranches = (results) => {
    console.log("showBranches", results);
    bbbMap.ui.setHeader(results.features);

    const layerInfo = bbbMap._config.layers.find((l) => l.id === bbbMap.branchSearchID);
    const layer = Object.assign({}, layerInfo, { fields: results.fields, source: results.features });

    bbbMap.buildFeatureLayer(layer, true, true);
};

bbbMap.showBranchesBankFind = (branches) => {
    console.log("showBranches", branches);
    bbbMap.ui.setHeader(branches);

    bbbMap.missingGeocodes = branches.filter((x) => x.LATITUDE === 0);
    branches = branches.filter((x) => x.LATITUDE !== 0);

    if (branches.length > 0) {
        const branchSource = branches.map((branch) => {
            return {
                geometry: {
                    type: "point",
                    longitude: branch.LONGITUDE,
                    latitude: branch.LATITUDE,
                },
                attributes: {
                    name: branch.OFFNAME,
                    address: branch.ADDRESS,
                    uninum: branch.UNINUM,
                    bank: branch.NAME,
                    cert: branch.CERT,
                },
            };
        });

        const features = {
            objectIdField: "uninum",
            outFields: ["name", "uninum", "address"],
            fields: [
                { name: "name", alias: "Branch Name", type: "string" },
                { name: "address", alias: "Branch Address", type: "string" },
                { name: "uninum", alias: "UNINUM", type: "string" },
                { name: "bank", alias: "Bank Name", type: "string" },
                { name: "cert", alias: "Bank Cert", type: "string" },
            ],
            source: branchSource,
        };

        const layerInfo = bbbMap._config.layers.find((l) => l.id === bbbMap.branchSearchID);
        const layer = Object.assign({}, layerInfo, features);

        bbbMap.buildFeatureLayer(layer);
    }
};

bbbMap.removeFeatureLayer = (layerId) => {
    console.log("removeFeatureLayer", layerId);
    const removeLayer = bbbMap.map.layers.items.find((l) => l.id === layerId);
    const removeTable = bbbMap.featureTables.find((l) => l.id === layerId);

    if (removeLayer) {
        removeLayer.destroy();
    }

    if (removeTable) {
        bbbMap.destroyFeatureTable(removeTable.id);
        bbbMap.showFeatureTable(false);
    }
};

bbbMap.xxxgetNearbyBranchInfo = async (ids) => {
    console.log("getBranchInfo", ids);
    let branchLayer = bbbMap.map.layers.items.find((l) => l.id === bbbMap.nearbyBranchesID);

    const branchQuery = { objectIds: ids, returnGeometry: true };
    console.log("branchQuery", branchQuery);

    const results = await branchLayer.queryFeatures(branchQuery);
    console.log("branchQuery results", results);
    return results;
};

bbbMap.getLayerInfo = async (id, layer) => {
    console.log("getBranchInfo", id, layer);

    const layerQuery = { objectIds: [id], returnGeometry: true };
    console.log("layerQuery", layerQuery);

    const results = await layer.queryFeatures(layerQuery);
    console.log("layerQuery results", results);
    return results;
};

bbbMap.xxxgetBranchInfo = async (ids) => {
    console.log("getBranchInfo", ids);

    let branchLayer = bbbMap.map.layers.items.find((l) => l.id === bbbMap.branchSearchID);

    const branchQuery = {
        objectIds: ids,
        returnGeometry: true,
    };

    //where: `UNINUMBR = ${id}`,

    console.log("branchQuery", branchQuery);

    const results = await branchLayer.queryFeatures(branchQuery);
    //const results = await bbbMap.branchReferenceLayer.queryFeatures(branchQuery);

    console.log("branchQuery results", results);

    return results;
};

bbbMap.removeFeatureSearch = function () {
    if (bbbMap.searchContainer) {
        bbbMap.view.ui.remove(bbbMap.searchContainer);
        bbbMap.searchContainer.remove();
    }
};

bbbMap.addFeatureSearch = function (table) {
    console.log("addFeatureSearch", table);

    let s = {
        label: "Search Features",
        autoCloseMenu: true,

        icon: "search",
        clickFunction: function (e) {
            console.log("Search Clicked", e);

            bbbMap.removeFeatureSearch();

            searchContainer = document.createElement("div");
            searchContainer.innerHTML = "Press Enter to Search";
            searchContainer.id = "featureSearchContainer";
            searchBox = document.createElement("calcite-input-text");
            let go = document.createElement("calcite-button");
            go.innerHTML = "Go";
            go.slot = "action";

            let btn = document.createElement("calcite-button");
            btn.innerHTML = "X";
            btn.slot = "action";
            btn.onclick = (e) => {
                console.log("Search X click", e);
                table.layer.definitionExpression = "";
                bbbMap.removeFeatureSearch();
            };

            searchBox.appendChild(btn);
            searchContainer.appendChild(searchBox);
            searchBox.placeholder = "Search Features";
            bbbMap.searchContainer = searchContainer;
            searchContainer.addEventListener("calciteInputTextChange", async (e) => {
                let searchString = e.target.value.toUpperCase();
                searchString = bbbMap.sanitizeInputs(searchString);

                let f = table.columns.items.filter((x) => (!x.hidden && x.field.type === "string") || x.field.type === "double" || x.field_type === "integer");
                let q = "",
                    c = "";
                f.forEach((x, i) => {
                    console.log(x.field.type, x.field.name, i);
                    c = i > 0 ? "or" : "";
                    q += x.field.type === "string" ? ` ${c} UPPER(${x.field.name}) like '%${searchString}%' ` : ` ${c} ${x.field.name} = '${searchString}' `;
                });

                console.log("Applying definitionExpression", q);
                table.layer.definitionExpression = q;

                let response = await table.layer.queryExtent();
                console.log("Response", response);
                if (response.count > 0) {
                    bbbMap.view.goTo(response.extent, bbbMap.goToOptions);
                }
            });

            bbbMap.view.ui.add(searchContainer, "bottom-right");
        },
    };

    table.menuConfig = { items: [s] };
};

bbbMap.buildFeatureTable = (layer) => {
    console.log("buildFeatureTable", layer);

    const c = document.createElement("div");
    c.id = layer.id;

    const featureTable = new bbbMap.esri.FeatureTable({
        id: layer.id,
        view: bbbMap.view,
        highlightEnabled: true,
        visibleElements: { columnMenus: false },
        layer: layer,
        hiddenFields: ["OBJECTID"],
        container: c,
    });

    featureTable.when((table) => {
        console.log(layer.id, "feature table complete");
        bbbMap.featureTables.push(table);
        bbbMap.showFeatureTable(layer.id);
        bbbMap.addFeatureSearch(table);
    });

    featureTable.highlightIds.on("change", async (event) => {
        console.log(layer.id, "feature table item selected", event);
        if (event.added.length > 0) {
            let id = event.added[0];
            event.target.items.map((x) => (id === x ? null : event.target.remove(x)));
            let b = await bbbMap.getLayerInfo(id, featureTable.layer);
            bbbMap.view.openPopup({ features: b.features });
        } else {
            bbbMap.view.closePopup();
        }
    });
};

bbbMap.buildFeatureLayer = async (layer, includeTable = true, zoom = true) => {
    console.log("buildFeatureLayer", layer, includeTable, zoom);
    bbbMap.removeFeatureLayer(layer.id);

    if (layer.source.length > 0) {
        console.log(layer.id, "Creating Feature Layer");
        const featureLayer = new bbbMap.esri.FeatureLayer(layer);
        bbbMap.map.add(featureLayer);

        //bbbMap.startScrim(bbbMap.mainScrim, `Loading layer ${layer.id}`);
        const layerView = await featureLayer.load();

        console.log(layer.id, "load complete", layerView);
        const result = await layerView.queryExtent();
        console.log(layer.id, "Extent", result);
        featureLayer._bbbLayerView = layerView;

        bbbMap.map.add(featureLayer);

        if (includeTable) {
            bbbMap.buildFeatureTable(featureLayer);
        }

        if (zoom) {
            bbbMap.view.goTo(result.extent, bbbMap.goToOptions);
        }
    }
};

bbbMap.getNearbyBranches = async (feature, d = 1.2) => {
    console.log("getNearbyBranches", d, feature);

    if (feature) {
        bbbMap.selectedBranchFeature = feature;
    }

    if (bbbMap.selectedBranchFeature) {
        let g = bbbMap.bufferGraphicsLayer;

        //bbbMap.view.closePopup();

        bbbMap.nearbyBranchesScrim.hidden = false;
        bbbMap.nearbyBranchesScrim.loading = true;

        bbbMap.ui.openPanel(bbbMap.nearbyBranchesID);

        console.log("Getting buffered shape", bbbMap.selectedBranchFeature);

        const geom = bbbMap.esri.geometryEngine.geodesicBuffer(bbbMap.selectedBranchFeature.geometry, d, "miles");
        const graphic = new bbbMap.esri.Graphic({ geometry: geom, symbol: bbbMap.bufferedSymbol });
        g.removeAll();
        g.add(graphic);

        bbbMap.view.goTo(geom, bbbMap.goToOptions);

        let nearbyBranchQuery = {
            geometry: geom,
            spatialRelationship: "intersects",
            outFields: bbbMap.branchFields,
            returnGeometry: true,
        };
        //where: "BKMO=0",
        console.log("nearbyBranch Query", nearbyBranchQuery);

        const results = await bbbMap.branchReferenceLayer.queryFeatures(nearbyBranchQuery);
        bbbMap.showNearbyBranches(results);
    } else {
        console.log("No feature selected");
    }
};

bbbMap.showNearbyBranches = (results) => {
    console.log("Displaying nearbyBranches", results);
    bbbMap.nearbyBranchesScrim.hidden = true;

    bbbMap.ui.nearbyBranchesNoticeContent.innerHTML = `Found ${results.features.length} branch locations within a ${bbbMap._bufferSize} mile buffer`;
    bbbMap.ui.nearbyBranchesNotice.kind = "brand";
    bbbMap.ui.nearbyBranchesNotice.icon = "information";
    bbbMap.ui.nearbyBranchesNotice.setAttribute("open", true);

    const layerInfo = bbbMap._config.layers.find((l) => l.id === bbbMap.nearbyBranchesID);
    const layer = Object.assign({}, layerInfo, { fields: results.fields, source: results.features });

    bbbMap.buildFeatureLayer(layer, true, false);
};

bbbMap.getNearbyTracts = async (feature, d = 1.2) => {
    console.log("getNearbyTract", feature, d);
    if (feature) {
        bbbMap.selectedTractFeature = feature;
    }

    if (bbbMap.selectedTractFeature) {
        let g = bbbMap.bufferGraphicsLayer;

        bbbMap.censusScrim.hidden = false;
        bbbMap.censusScrim.loading = true;
        bbbMap.ui.openPanel(bbbMap.censusTractID);

        //Create buffers around the buffers and return the union since more than one branch can be selected
        const geom = bbbMap.esri.geometryEngine.geodesicBuffer(bbbMap.selectedTractFeature.geometry, d, "miles");
        const graphic = new bbbMap.esri.Graphic({ geometry: geom, symbol: bbbMap.bufferedSymbol });

        g.removeAll();
        g.add(graphic);
        //g.add(new bbbMap.esri.Graphic(geom, bbbMap.bufferedSymbol));

        //zoom to buffer
        //bbbMap.view.goTo(geom);

        let censusTractQuery = {
            geometry: geom,
            spatialRelationship: "intersects",
            //spatialRelationship: "contains",
            outFields: ["OBJECTID ", "NAME", "State", "County", "ALAND", "B01001_001E", "B01001_001M", "B01001_002E", "B01001_003E", "B01001_calc_pctDependE", "B01001_calc_sexRatioE", "B01001_calc_numLT18E", "B01001_calc_pctDependE"],
            returnGeometry: true,
            returnCentroid: true,
        };

        const tracts = await bbbMap.censusTractReferenceLayer.queryFeatures(censusTractQuery);
        bbbMap.showCensusTracts(tracts);
    } else {
        console.log("No tract selected");
    }
};

bbbMap.xxxgetCensusTracts = async (ids) => {
    console.log("getCensusTracts", ids);
    //bbbMap.view.ui.remove(bbbMap.analyzeBranchContainer);

    bbbMap.censusScrim.hidden = false;
    bbbMap.censusScrim.loading = true;
    bbbMap.ui.openPanel(bbbMap.censusTractID);

    let branchLayer = bbbMap.map.layers.items.find((l) => l.id === bbbMap.branchSearchID);

    let branchId = ids.join(",");

    const branchQuery = {
        where: `UNINUMBR in (${branchId})`,
        returnGeometry: true,
    };

    console.log("Query Branches", branchId, branchQuery);
    const branches = await branchLayer.queryFeatures(branchQuery);

    console.log("Census query results", branches.features);
    //Create buffers around the buffers and return the union since more than one branch can be selected
    let branchGeoms = branches.features.map((m) => bbbMap.esri.geometryEngine.geodesicBuffer(m.geometry, 1.2, "miles"));
    let s = bbbMap.esri.geometryEngine.union(branchGeoms);

    let censusTractQuery = {
        geometry: s,
        spatialRelationship: "intersects",
        outFields: ["OBJECTID ", "NAME", "State", "County", "ALAND", "B01001_001E", "B01001_001M", "B01001_002E", "B01001_003E", "B01001_calc_pctDependE", "B01001_calc_sexRatioE", "B01001_calc_numLT18E", "B01001_calc_pctDependE"],
        returnGeometry: true,
        returnCentroid: true,
    };

    const tracts = await bbbMap.censusTractReferenceLayer.queryFeatures(censusTractQuery);
    bbbMap.showCensusTracts(tracts);
};

bbbMap.showCensusTracts = (results) => {
    console.log("showCensusTracts", results);
    console.log("Displaying nearbyBranches", results);

    bbbMap.censusScrim.hidden = true;

    bbbMap.ui.censusTractsNoticeContent.innerHTML = `Found ${results.features.length} census tract(s) within a ${bbbMap._bufferSize} mile buffer`;
    bbbMap.ui.censusTractsNotice.kind = "brand";
    bbbMap.ui.censusTractsNotice.icon = "information";
    bbbMap.ui.censusTractsNotice.setAttribute("open", true);

    const layerInfo = bbbMap._config.layers.find((l) => l.id === bbbMap.censusTractID);

    console.log("census", layerInfo);
    const layer = Object.assign({}, layerInfo, { fields: results.fields, source: results.features });

    bbbMap.buildFeatureLayer(layer, true, true);
};

bbbMap.ui.setHeader = (branches = []) => {
    let id = "bankInfo",
        info = document.getElementById(id);
    menu = document.getElementById("navigationMenu");

    if (info) {
        menu.removeChild(info);
    }

    if (bbbMap.cert) {
        let bankInfo = document.createElement("calcite-menu-item");
        bankInfo.id = id;
        bankInfo.text = `${bbbMap.bankName} (${bbbMap.cert}): ${branches.length} branches found`;

        bankInfo.textEnabled = true;
        bankInfo.active = 1;
        bankInfo.onclick = ({ target }) => console.log("Bank Name Info Click", target);

        menu.appendChild(bankInfo);
    }
};

bbbMap.showFeatureContainer = (on = true) => {
    let c = bbbMap.featureTableContainer;

    try {
        //if (bbbMap.featureTables.length > 0) {
        on ? bbbMap.appContainer.appendChild(c) : bbbMap.appContainer.removeChild(c);
        //}
    } catch (e) {
        console.log("Error showing feature tables", e);
    }
};

bbbMap.errorHandler = (e) => {
    console.log("errorHandler", e);
    document.getElementById("errorAlertTitle").innerHTML = `Error: ${e.details.messages[0]}`;
    document.getElementById("errorAlert").open = true;
};

bbbMap.showFeatureTable = (id) => {
    let c = bbbMap.featureTableContainer;
    bbbMap.removeFeatureSearch();
    while (c.hasChildNodes()) {
        c.removeChild(c.firstChild);
    }

    let featureTable = bbbMap.featureTables.find((x) => x.id === id);

    if (featureTable) {
        c.appendChild(featureTable.container);
        c.parentNode ? null : bbbMap.appContainer.appendChild(c);
    }
};

bbbMap.destroyFeatureTable = (id) => {
    let i = bbbMap.featureTables.findIndex((x) => x.id === id);
    bbbMap.featureTables.find((x) => x.id === id).destroy();
    bbbMap.featureTables.splice(i);
};

bbbMap.ui.openPanel = (panel) => {
    console.log("openPanel", panel);

    if (bbbMap.activePanel) {
        bbbMap.ui.closePanel(bbbMap.activePanel);
    }

    let b = document.querySelector(`[data-action-id=${panel}]`);
    let p = document.querySelector(`[data-panel-id=${panel}]`);

    console.log("button", b, "panel", p);
    if (b) b.active = true; // active the button
    if (p) p.closed = false; //open the panel

    bbbMap.activePanel = panel;

    let featureTable = bbbMap.featureTables.find((x) => x.id === panel);
    if (featureTable) {
        bbbMap.showFeatureTable(panel);
    }
};

bbbMap.ui.closePanel = (panel) => {
    console.log("closePanel", panel);
    document.querySelector(`[data-action-id=${panel}]`).active = false;
    document.querySelector(`[data-panel-id=${panel}]`).closed = true;
    bbbMap.activePanel = "";
};

bbbMap.bufferedSymbol = {
    type: "simple-fill",
    color: [255, 255, 0, 0.1],
    outline: {
        color: [255, 255, 0, 0.3],
        width: 0,
    },
};

//bbbMap.branchFields = ['CERT','NAMEFULL','BRNUM','UNINUMBR','NAMEBR','ADDRESBR','DEPSUMBR','CBSABR','CBSANAMB','STCNTYBR','GEOCODE_CENSUS_TRACT','STATUS','SCORE','x','y','REPDTE'];
bbbMap.branchFields = ["CERT", "NAME", "OFFNUM", "UNINUM", "OFFNUM", "ADDRESS", "CBSA", "CBSA_NO", "CBSA_METRO_NAME", "STNAME", "CITY", "COUNTY", "STCNTY", "SERVTYPE", "LATITUDE", "LONGITUDE", "RUNDATE"];
