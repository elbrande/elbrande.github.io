const bbbMap = {};
bbbMap.ui = {};
bbbMap._config = {};

bbbMap.sanitizeInputs = (i) => {
    return String(i)
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();
};

bbbMap.getDataSourceConfig = () => {
    bbbMap.bankService = "https://banks.data.fdic.gov/api/institutions?fields=ZIP,ADDRESS,%2COFFDOM%2CCITY%2CCOUNTY%2CSTNAME%2CSTALP%2CNAME%2CACTIVE%2CCERT%2CCBSA%2CASSET%2CNETINC%2CDEP%2CDEPDOM%2CROE%2CROA%2CDATEUPDT%2COFFICES&sort_by=NAME&sort_order=DESC&limit=100&offset=0&format=json&download=false&filename=data_file";
    bbbMap.censusTractService = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Total_Population_Boundaries/FeatureServer/2";
    bbbMap.nearbyBranchService = "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/FDIC_InsuredBanks/FeatureServer/0";
    bbbMap.branchService = "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/FDIC_InsuredBanks/FeatureServer/0";
};

bbbMap.getLayerConfig = () => {
    bbbMap._config.layers = [];

    bbbMap.branchSearchID = "branchSearch";
    bbbMap.censusTractID = "censusTracts";
    bbbMap.nearbyBranchesID = "nearbyBranches";

    //bbbMap._config.layers.push ({layerId: 1, id:"branchSearch", title:"Branch Locations",objectIdField:["*"],popupEnabled: 1, renderer: {type: "simple", symbol: { type: "simple-fill", outline: {color: [170, 160, 160, 0.90]}, color: [250, 240, 105, 0.75] }}, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1});
    bbbMap._config.layers.push({ layerId: 1, id: bbbMap.branchSearchID, title: "Branch Locations", objectIdField: "OBJECTID", outFields: ["*"], popupEnabled: 1, renderer: bbbMap.branchRenderer.dark, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1 });
    bbbMap._config.layers.push({ layerId: 2, id: bbbMap.nearbyBranchesID, title: "Nearby Branches", objectIdField: "OBJECTID", outFields: ["*"], popupEnabled: 1, renderer: bbbMap.nearbyBranchRenderer.dark, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1 });
    bbbMap._config.layers.push({ layerId: 0, id: bbbMap.censusTractID, title: "Census Tracts", objectIdField: "OBJECTID", outFields: ["*"], popupEnabled: 1, legendEnabled: 1, visible: 1, renderer: bbbMap.censusTractRenderer.dark });
};

bbbMap.init = () => {
    console.log("bbbMap.init");
    bbbMap.apiKey = "AAPK0cd2f0f32a494df3ae6c449ac67faabbfaPt0C5s0X6EPcaWH0P-2j_6PUAOrvcB2sERatzoXpK7Cc_z7F5JL40rCzTiDPLT";

    //bbbMap.goToOptions = { animate: true, animationMode: "auto", duration: 1000, maxDuration: 2000, easing: "ease" };
    bbbMap.getDataSourceConfig();
    bbbMap.getLayerConfig();
    bbbMap.initMap();
    bbbMap.ui.init();
};

bbbMap.initMap = () => {
    require(["esri/config", "esri/layers/FeatureLayer", "esri/widgets/FeatureTable", "esri/geometry/geometryEngine"], (esriConfig, FeatureLayer, FeatureTable, geometryEngine) =>
        (async () => {
            esriConfig.apiKey = bbbMap.apiKey;

            bbbMap.esri = {};
            bbbMap.esri.geometryEngine = geometryEngine;
            bbbMap.esri.FeatureLayer = FeatureLayer;
            bbbMap.esri.FeatureTable = FeatureTable;

            bbbMap.censusTractReferenceLayer = new FeatureLayer({ id: "censusTractService", url: bbbMap.censusTractService });
            bbbMap.branchReferenceLayer = new FeatureLayer({ id: "branchService", url: bbbMap.branchService });
        })()); //end require
};

bbbMap.ui.init = () => {
    console.log("ui.init");

    bbbMap.formats = {};
    bbbMap.formats.USDollar = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

    //search
    bbbMap.ui.bankSearchBtn = document.getElementById("bankSearchBtn");
    bbbMap.ui.bankSearchCert = document.getElementById("bankSearchCert");

    document.querySelectorAll("#nav-list li").forEach((p) => {
        p.addEventListener("click", (e) => {
            let id = e.target.dataset.sectionId;
            console.log("tab click", id);
            bbbMap.showSection(id);
        });
    });

    bbbMap.showSection("branchSearch");

    bbbMap.ui.bankSearchBtn.addEventListener("click", async (e) => {
        console.log("Bank Search Button clicked", e);
        e.preventDefault();
        let bankURL = bbbMap.bankService,
            cert = bbbMap.sanitizeInputs(bbbMap.ui.bankSearchCert.value);

        console.log("cert", cert);

        let inputPass = 1,
            msg = "",
            bankWhere = ``;
        if (cert.length === 0) {
            msg = `Please enter a value for cert`;
            inputPass = false;
        } else if (cert.length < 1) {
            msg = `Please enter a valid cert number a longer name ${bbbMap.ui.bankSearchCert.value} will not return any results.`;
            inputPass = false;
        }

        if (!inputPass) {
            //bbbMap.ui.searchResultsNoticeContent.innerHTML = msg;
        } else {
            if (cert.length > 0) {
                bankWhere += `CERT=${cert}`;
            }

            const q = {
                where: bankWhere,
                outFields: bbbMap.branchFields, //["*"],
                returnGeometry: false,
            };

            const results = await bbbMap.branchReferenceLayer.queryFeatures(q);
            console.log("Branch Search Results", results);
            bbbMap.getBranches(results);

            //const table = bbbMap.buildHTMLTable(results);
            //console.log("table", table);
            //const table = bbbMap.buildTabulator(results);
            //const container = document.getElementById("search-results");
            //container.innerHTML = ``;
            //container.appendChild(table);
            //$(table).DataTable();
        }
    });
};

bbbMap.hideSectionAll = function () {
    document.querySelectorAll("section.blam-section").forEach((p) => {
        console.log("s", p);
        p.style.display = "none";
    });
};

bbbMap.showSection = function (id) {
    const section = document.getElementById(id);
    if (section) {
        bbbMap.hideSectionAll();
        section.style.display = "";
    }
};

bbbMap.createFeatureLayer = function (results, id) {
    const layerInfo = bbbMap._config.layers.find((l) => l.id === id);
    const layer = Object.assign({}, layerInfo, { fields: results.fields, source: results.features });
    const featureLayer = new bbbMap.esri.FeatureLayer(layer);
    return featureLayer;
};

bbbMap.createFeatureTable = function (featureLayer, id, container) {
    const c = document.createElement("div");
    c.id = id;

    const featureTable = new bbbMap.esri.FeatureTable({
        id: id,
        header: false,
        menuConfig: { disabled: true },
        visibleElements: { menu: false, selectionColumn: true },
        layer: featureLayer,
        container: c,
    });
    //container.appendChild(c);
    featureTable.multipleSelectionEnabled = false;
    featureTable.on("cell-click", function (e) {
        console.log("cell-click", e);
    });

    return { featureTable, c };
};

bbbMap.getBranchesFieldset = function (featureTable) {
    const fieldSet = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerHTML = `Filter Results`;
    fieldSet.appendChild(legend);
    const div = document.createElement("div");
    div.classList.add("form-group");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.id = "branchFilter";
    label.for = "branchFilter";
    label.innerHTML = `Branch Filter:`;
    input.type = "text";
    input.name = "branch filter";
    input.ariaRequired = "false";
    input.placeholder = "Filter Branches ";
    input.addEventListener("input", (e) => {
        console.log("Blur", featureTable, e);
        let searchString = e.target.value.toUpperCase();
        //searchString = bbbMap.sanitizeInputs(searchString);

        let f = featureTable.columns.items.filter((x) => (!x.hidden && x.field.type === "string") || x.field.type === "double" || x.field_type === "integer");
        let q = "",
            c = "";
        f.forEach((x, i) => {
            // console.log(x.field.type, x.field.name, i);
            c = i > 0 ? "or" : "";
            q += x.field.type === "string" ? ` ${c} UPPER(${x.field.name}) like '%${searchString}%' ` : ` ${c} ${x.field.name} = '${searchString}' `;
        });

        //console.log("Applying definitionExpression", q);
        featureTable.layer.definitionExpression = q;
    });

    div.appendChild(label);
    div.appendChild(input);

    fieldSet.appendChild(div);

    featureTable.highlightIds.on("change", (e) => {
        console.log("features selected", e.added, featureTable.highlightIds.items);
        const objectId = e.added[0];
        console.log("object", objectId);
        if (bbbMap?.getAffectedBtn) {
            div.removeChild(bbbMap.getAffectedBtn);
            bbbMap.getAffectedBtn = "";
        }
        if (objectId) {
            bbbMap.getAffectedBtn = document.createElement("button");
            bbbMap.getAffectedBtn.ariaLabel = "Get Affected Tracts";
            bbbMap.getAffectedBtn.innerHTML = "Get Affected Tracts";

            bbbMap.getAffectedBtn.addEventListener("click", (e) => {
                bbbMap.getAffectedTracts(objectId);
            });

            div.appendChild(bbbMap.getAffectedBtn);
        }
    });
    return fieldSet;
};

bbbMap.getBranches = function (results) {
    if (results.features.length > 0) {
        bbbMap.cert = results.features[0].attributes.CERT;

        const container = document.getElementById("branchSearchContent");
        container.innerHTML = ``;
        //const layerInfo = bbbMap._config.layers.find((l) => l.id === bbbMap.branchSearchID);
        //const layer = Object.assign({}, layerInfo, { fields: results.fields, source: results.features });
        //const featureLayer = new bbbMap.esri.FeatureLayer(layer);
        const featureLayer = bbbMap.createFeatureLayer(results, bbbMap.branchSearchID);

        const { featureTable, c } = bbbMap.createFeatureTable(featureLayer, bbbMap.branchSearchID, container);

        const fieldSet = bbbMap.getBranchesFieldset(featureTable);
        container.appendChild(fieldSet);

        container.appendChild(c);
    }
};

bbbMap.getAffectedTracts = function (id) {
    console.log("getAffectedTracts", id);
    document.getElementById("affectedTractsContent").innerHTML = `booya ${id}`;
    bbbMap.showSection("affectedTracts");
};

bbbMap.getNearbyTracts = function (id) {
    console.log("getNearbyTracts", id);
};

bbbMap.bufferedSymbol = {
    type: "simple-fill",
    color: [255, 255, 0, 0.05],
    outline: {
        color: [255, 255, 0, 0.3],
        width: 0.5,
    },
};

bbbMap.branchRenderer = { dark: { type: "simple", symbol: { type: "simple-marker", size: 8, color: [56, 182, 255, 0.55], outline: { width: 0, color: "white" } } } };
bbbMap.nearbyBranchRenderer = { dark: { type: "simple", symbol: { type: "simple-marker", size: 8, color: [102, 204, 102, 0.55], outline: { width: 0, color: "white" } } } };
bbbMap.censusTractRenderer = { dark: { type: "simple", symbol: { type: "simple-fill", outline: { width: 0.5, color: [250, 255, 255, 0.5] }, color: [20, 130, 200, 0.35] } } };

//bbbMap.branchFields = ['CERT','NAMEFULL','BRNUM','UNINUMBR','NAMEBR','ADDRESBR','DEPSUMBR','CBSABR','CBSANAMB','STCNTYBR','GEOCODE_CENSUS_TRACT','STATUS','SCORE','x','y','REPDTE'];
bbbMap.branchFields = ["CERT", "NAME", "OFFNUM", "UNINUM", "OFFNUM", "ADDRESS", "CBSA", "CBSA_NO", "CBSA_METRO_NAME", "STNAME", "CITY", "COUNTY", "STCNTY", "SERVTYPE", "LATITUDE", "LONGITUDE", "RUNDATE"];

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
    bbbMap.init();
});
