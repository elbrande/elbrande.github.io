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
    bbbMap.censusTractID = "affectedTracts";
    bbbMap.nearbyBranchesID = "nearbyBranches";

    bbbMap.allSections = [bbbMap.branchSearchID, bbbMap.censusTractID, bbbMap.nearbyBranchesID];

    //bbbMap._config.layers.push ({layerId: 1, id:"branchSearch", title:"Branch Locations",objectIdField:["*"],popupEnabled: 1, renderer: {type: "simple", symbol: { type: "simple-fill", outline: {color: [170, 160, 160, 0.90]}, color: [250, 240, 105, 0.75] }}, legendEnabled: 1, effect: "bloom(1.5, 0.5px, 0.1)", visible: 1});
    bbbMap._config.layers.push({ layerId: 1, id: bbbMap.branchSearchID, title: "Branch Locations", objectIdField: "OBJECTID", visible: 1, outFields: bbbMap.branchOutFields, fields: bbbMap.branchFields, fxn: bbbMap.highlightBranch, showLDT: false });
    bbbMap._config.layers.push({ layerId: 0, id: bbbMap.censusTractID, title: "Affected Tracts", objectIdField: "OBJECTID", visible: 1, outFields: bbbMap.tractOutFields, fields: bbbMap.tractFields, fxn: bbbMap.highlightAffectedTracts, showLDT: true });
    bbbMap._config.layers.push({ layerId: 2, id: bbbMap.nearbyBranchesID, title: "Nearby Branches", objectIdField: "OBJECTID", visible: 1, outFields: bbbMap.branchOutFields, fields: bbbMap.branchFields, fxn: bbbMap.highlightNearbyBranches, showLDT: true });
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

    bbbMap.ui.branchSearchHeader = document.getElementById("branchSearchHeader");
    bbbMap.ui.branchSearchTable = document.getElementById("branchSearchTable");
    bbbMap.ui.affectedTractsHeader = document.getElementById("affectedTractsHeader");
    bbbMap.ui.affectedTractsTable = document.getElementById("affectedTractsTable");
    bbbMap.ui.nearbyBranchesHeader = document.getElementById("nearbyBranchesHeader");
    bbbMap.ui.nearbyBranchesTable = document.getElementById("nearbyBranchesTable");
    bbbMap.ui.sections = [bbbMap.ui.branchSearchHeader, bbbMap.ui.branchSearchTable, bbbMap.ui.affectedTractsHeader, bbbMap.ui.affectedTractsTable, bbbMap.ui.nearbyBranchesHeader, bbbMap.ui.nearbyBranchesTable];

    bbbMap.ui.resetSectionsAll = function () {
        bbbMap.ui.sections.forEach((section) => {
            section.innerHTML = ``;
        });
    };
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
        bbbMap.ui.resetSectionsAll();
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
            msg = `Please enter a valid cert.  "${bbbMap.ui.bankSearchCert.value}" will not return any results.`;
            inputPass = false;
        } else if (Number.isNaN(Number(cert))) {
            msg = `Please enter a valid cert number.  "${bbbMap.ui.bankSearchCert.value}" is not a number.`;
            inputPass = false;
        }

        if (!inputPass) {
            bbbMap.ui.branchSearchHeader.innerHTML = msg;
        } else {
            if (cert.length > 0) {
                bankWhere += `CERT=${cert}`;
            }

            const q = {
                where: bankWhere,
                outFields: bbbMap.branchOutFields, //["*"],
                returnGeometry: true,
            };

            const results = await bbbMap.branchReferenceLayer.queryFeatures(q);
            console.log("Branch Search Results", results);
            bbbMap.getBranches(results, cert);
        }
    });
};

bbbMap.clearResults = function (ids = [bbbMap.branchSearchID, bbbMap.censusTractID, bbbMap.nearbyBranchesID]) {
    ids.forEach((id) => {
        document.getElementById(`${id}Header`).innerHTML = "";
        document.getElementById(`${id}Table`).innerHTML = "";
    });
};

bbbMap.hideSectionAll = function () {
    document.querySelectorAll("section.bbb-section").forEach((p) => {
        console.log("Hide Section", p.id);
        p.style.display = "none";
        document.getElementById(`${p.id}Nav`).classList.remove("btn-active");
    });
};

bbbMap.showSection = function (id) {
    console.log("showSection", id);
    const section = document.getElementById(id);
    if (section) {
        bbbMap.hideSectionAll();
        document.getElementById(`${id}Nav`).classList.add("btn-active");
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

bbbMap.getBranches = function (results, cert) {
    bbbMap.clearResults([bbbMap.branchSearchID, bbbMap.censusTractID, bbbMap.nearbyBranchesID]);
    if (results.features.length > 0) {
        bbbMap.branchResults = results;
        const table = bbbMap.createCalciteTable(results, bbbMap.branchSearchID);
        bbbMap.branchTable = table;
        const bank = results.features[0].attributes.NAME;
        const header = bbbMap.getHeader(results, table, bbbMap.branchSearchID, `Found ${results.features.length} branches for ${bank} (${cert})`);
    } else {
        msg = `No branches found for Cert "${cert}".  Please try again.`;
        bbbMap.ui.branchSearchHeader.innerHTML = msg;
    }
};

bbbMap.getAffectedTracts = async function (id, ldtDist) {
    console.log("getAffectedTracts", id, ldtDist);
    try {
        let branch = bbbMap.branchResults.features.find((f) => f.attributes.UNINUM == id);

        const data = branch.attributes;
        const point = branch.geometry;

        console.log("getAffectedTracts data", branch, data, point);
        bbbMap.ldtDefault = data.ldt || 1.8;
        bbbMap.ldt = ldtDist || data.ldt || 1.8;
        if (Number.isNaN(parseInt(bbbMap.ldt, 10))) {
            throw new Error(`${bbbMap.ldt} is not a valid number.  Please try entering a number.`);
        } else {
            //bbbMap.showLDT(bbbMap.ldt);
            bbbMap.clearResults([bbbMap.censusTractID, bbbMap.nearbyBranchesID]);
            console.log("getAffectedTracts ldt", bbbMap.ldt, point);

            const geom = bbbMap.esri.geometryEngine.geodesicBuffer(point, bbbMap.ldt, "miles");
            console.log("getAffectedTracts geom", geom);

            const q = {
                geometry: geom,
                spatialRelationship: "intersects",
                outFields: bbbMap.tractOutFields,
                returnGeometry: true,
                returnCentroid: true,
            };

            const results = await bbbMap.censusTractReferenceLayer.queryFeatures(q);
            bbbMap.censusTractResults = results;
            console.log("getAffectedTracts results", results);

            if (results.features.length > 0) {
                const table = bbbMap.createCalciteTable(results, bbbMap.censusTractID);
                bbbMap.tractTable = table;
                const branch = data.OFFNAME;
                const header = bbbMap.getHeader(results, table, bbbMap.censusTractID, `Found ${results.features.length} census tracts within ${bbbMap.ldt} miles of ${branch} (${id})`);
            } else {
                msg = `No tracts found within ${bbbMap.ldt} miles of branch ${id}.  Please try again.`;
                bbbMap.ui.affectedTractsHeader.innerHTML = msg;
            }

            bbbMap.addLDTUpdate(id, bbbMap.censusTractID);
        }
    } catch (e) {
        console.log("Error", e);
        alert(e);
    } finally {
        bbbMap.showSection(bbbMap.censusTractID);
    }
};

bbbMap.getNearbyBranches = async function (id, ldtDist) {
    console.log("getNearbyBranches", id);
    try {
        bbbMap.clearResults([bbbMap.nearbyBranchesID]);

        let tract = bbbMap.censusTractResults.features.find((f) => f.attributes.GEOID == id);
        let ldt = ldtDist || bbbMap.ldt;
        const data = tract.attributes;
        const point = tract.geometry.centroid || tract.geometry.centroid;

        console.log("getNearbyBranches data", tract, data, point);

        console.log("getNearbyBranches ldt", bbbMap.ldt, point);
        bbbMap.ldt = ldtDist || bbbMap.ldt || 1.8;

        if (Number.isNaN(parseInt(bbbMap.ldt, 10))) {
            throw new Error(`${bbbMap.ldt} is not a valid number.  Please try entering a number.`);
        } else {
            const geom = bbbMap.esri.geometryEngine.geodesicBuffer(point, bbbMap.ldt, "miles");
            console.log("getNearbyBranches geom", geom);

            const q = {
                geometry: geom,
                spatialRelationship: "intersects",
                outFields: bbbMap.branchOutFields,
                returnGeometry: true,
            };

            const results = await bbbMap.branchReferenceLayer.queryFeatures(q);
            bbbMap.nearbyBranchResults = results;
            console.log("getNearbyBranches results", results);

            if (results.features.length > 0) {
                const table = bbbMap.createCalciteTable(results, bbbMap.nearbyBranchesID);
                bbbMap.tractTable = table;

                const tract = data.GEOID;
                const header = bbbMap.getHeader(results, table, bbbMap.nearbyBranchesID, `Found ${results.features.length} branches within ${bbbMap.ldt} miles of census tract ${tract}`);
            } else {
                msg = `No branches found within ${bbbMap.ldt} miles of tract ${id}.  Please try again.`;
                bbbMap.ui.nearbyBranchesHeader.innerHTML = msg;
            }
            bbbMap.addLDTUpdate(id, bbbMap.nearbyBranchesID);
        }
    } catch (e) {
        console.log("Error", e);
        alert(e);
    } finally {
        bbbMap.showSection(bbbMap.nearbyBranchesID);
    }
};

bbbMap.getLayerInfo = function (id) {
    const layerInfo = bbbMap._config.layers.find((l) => l.id === id);
    return layerInfo;
};

bbbMap.createCalciteTable = function (results, id, filter) {
    console.log("createCalciteTable", id, results, filter);
    const container = document.getElementById(`${id}Table`);
    //const div = document.createElement("div");

    container.innerHTML = ``;
    const layerInfo = bbbMap.getLayerInfo(id);

    const table = document.createElement("calcite-table");
    table.caption = `${id} Results`;
    table.zebra = true;
    table.numbered = true;
    table.bordered = true;
    table.interactionMode = "static";
    table.pageSize = "10";
    table.selectionDisplay = "none";
    table.selectionMode = "single";
    table.id = `{id}Table`;

    const headerRow = document.createElement("calcite-table-row");
    headerRow.slot = "table-header";

    let fields = layerInfo.fields.filter((f) => f._print);

    let tableData = [...results.features];
    tableData = tableData.map((x) => x.attributes);
    let filterText = "";
    if (filter) {
        console.log("filtering table data", filter, tableData);
        tableData = tableData.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().includes(filter.toString().toLowerCase())));
        filterText = ` using filter "${filter}"`;
    }
    const display = tableData.slice(0, bbbMap.ROW_LIMIT);
    const data = display;

    container.innerHTML = `Showing ${tableData.length} results${filterText}.  Note: Tables are limited to ${bbbMap.ROW_LIMIT} rows.  Please use the filter to refine results if needed.`;

    fields.forEach((field) => {
        let th = document.createElement("calcite-table-header");
        th.heading = field.alias;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);
    const pk = id === bbbMap.censusTractID ? "GEOID" : "UNINUM";
    for (const r of display) {
        const values = fields.map((field) => r[field.name]);
        const row = document.createElement("calcite-table-row");

        row.id = r[pk];

        values.forEach((obj, i) => {
            const td = document.createElement("calcite-table-cell");
            td.innerHTML = obj;
            row.appendChild(td);
        });

        table.appendChild(row);
    }

    if (layerInfo.fxn) {
        table.addEventListener("calciteTableSelect", layerInfo.fxn);
    }

    container.appendChild(table);
    return table;
};

bbbMap.getHeader = function (results, table, id, msg = "") {
    console.log("getHeader");
    const container = document.getElementById(`${id}Header`);
    container.innerHTML = ``;
    const layerInfo = bbbMap.getLayerInfo(id);

    const fieldSet = document.createElement("fieldset");
    const legend = document.createElement("legend");

    legend.innerHTML = `${layerInfo.title}`;

    fieldSet.appendChild(legend);
    const title = document.createElement("p");
    title.innerHTML = `${msg}`;
    fieldSet.appendChild(title);

    const div = document.createElement("div");
    div.classList.add("form-group");

    const label = document.createElement("calcite-label");
    const input = document.createElement("calcite-input");
    const btn = document.createElement("calcite-button");
    btn.iconStart = "filter";
    btn.slot = "action";
    btn.innerHTML = "Filter Results";

    input.id = `${id}Filter`;
    input.type = "text";
    input.name = `Filter ${layerInfo.title} `;
    input.ariaRequired = false;
    input.placeholder = `Filter by any value `;

    //input.addEventListener("blur", (e) => {
    btn.addEventListener("click", (e) => {
        // let searchString = e.target.value;
        let searchString = e.target?.parentNode?.value;

        const table = bbbMap.createCalciteTable(results, id, searchString);
    });

    //label.for = input.id;
    label.innerHTML = `Filter ${layerInfo.title}`;
    //label.layout = "inline";

    input.appendChild(btn);
    label.appendChild(input);
    div.appendChild(label);
    //div.appendChild(input);

    fieldSet.append(div);

    container.appendChild(fieldSet);

    return fieldSet;
};

bbbMap.addLDTUpdate = function (id, type) {
    const header = type === bbbMap.censusTractID ? bbbMap.ui.affectedTractsHeader : bbbMap.ui.nearbyBranchesHeader;
    const container = header.querySelector("fieldSet div.form-group");

    //select option
    const selectLabel = document.createElement("calcite-label");
    const select = document.createElement("calcite-select");
    select.label = "Select an LDT in miles";
    let distances = [bbbMap.ldt, bbbMap.ldtDefault, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const displayDistances = [...new Set(distances)];
    // distances.sort((a, b) => a - b);
    let selected, label;
    displayDistances.forEach((d) => {
        const option = document.createElement("calcite-option");

        selected = d === bbbMap.ldt ? true : false;
        console.log(d, bbbMap.ldt, selected);
        option.selected = selected;

        label = d == bbbMap.ldtDefault ? `${d} miles (default)` : `${d} miles`;
        option.value = d;
        option.innerHTML = label;
        option.label = label;
        select.appendChild(option);
    });

    select.addEventListener("calciteSelectChange", (e) => {
        console.log("selecty", e);
        let ldt = e.target.value;
        //
        //bbbMap.ldt = ldtDist || data.ldt || 1.8;

        if (Number.isNaN(Number(ldt))) {
            msg = `Not a valid number for distance.`;
            const err = document.createElement("calcite-input-message");
            err.innerHTML = msg;
            err.status = "invalid";
            label.appendChild(err);
        } else {
            //<calcite-input-message icon="frown" status="invalid">Apologies, this subdomain has already been registered.</calcite-input-message>
            if (type === bbbMap.censusTractID) {
                bbbMap.getAffectedTracts(id, ldt);
            } else {
                //(type === bbbMap.censusTractID)
                bbbMap.getNearbyBranches(id, ldt);
            }
        }
    });

    selectLabel.innerHTML = "LDT";
    selectLabel.appendChild(select);
    container.appendChild(selectLabel);
};

bbbMap.highlightBranch = function (e) {
    console.log("highlightBranch");
    const div = document.querySelector(`#${bbbMap.branchSearchID}Header fieldset`);
    const id = e.target.selectedItems[0].id;

    if (bbbMap.getAffectedBtn && div.contains(bbbMap.getAffectedBtn)) {
        div.removeChild(bbbMap.getAffectedBtn);
        bbbMap.getAffectedBtn = "";
    }

    if (id) {
        //bbbMap.getAffectedBtn = document.createElement("button");
        bbbMap.getAffectedBtn = document.createElement("calcite-button");
        bbbMap.getAffectedBtn.ariaLabel = "Find Affected Tracts";
        bbbMap.getAffectedBtn.innerHTML = `Find Affected Tracts`;
        bbbMap.getAffectedBtn.iconStart = "launch";
        bbbMap.getAffectedBtn.width = "full";
        //bbbMap.getAffectedBtn.setAttribute("accesskey", "r");

        bbbMap.getAffectedBtn.addEventListener("click", (e) => {
            bbbMap.getAffectedTracts(id);
        });

        div.appendChild(bbbMap.getAffectedBtn);
    }
};

bbbMap.highlightAffectedTracts = function (e) {
    console.log("highlightAffectedTracts");
    const div = document.querySelector(`#${bbbMap.censusTractID}Header fieldset`);
    console.log("highlightAffectedTracts", e, div);

    const id = e.target.selectedItems[0].id;

    console.log("object", id);

    if (bbbMap?.getNearbyBranchesBtn && div.contains(bbbMap.getNearbyBranchesBtn)) {
        div.removeChild(bbbMap.getNearbyBranchesBtn);
        bbbMap.getNearbyBranchesBtn = "";
    }

    if (id) {
        //bbbMap.getNearbyBranchesBtn = document.createElement("button");
        bbbMap.getNearbyBranchesBtn = document.createElement("calcite-button");
        bbbMap.getNearbyBranchesBtn.ariaLabel = "Find Nearby Branches";
        bbbMap.getNearbyBranchesBtn.innerHTML = `Find Nearby Branches`;
        bbbMap.getNearbyBranchesBtn.iconStart = "launch";
        bbbMap.getNearbyBranchesBtn.width = "full";
        //bbbMap.getNearbyBranchesBtn.setAttribute("accesskey", "g");

        bbbMap.getNearbyBranchesBtn.addEventListener("click", (e) => {
            bbbMap.getNearbyBranches(id);
        });

        div.appendChild(bbbMap.getNearbyBranchesBtn);
    }
};

bbbMap.highlightNearbyBranches = function () {
    console.log("highlightNearbyBranches");
    const div = document.querySelector(`#nearbyBranchesHeader fieldset`);
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
bbbMap.branchOutFields = ["CERT", "NAME", "OFFNUM", "UNINUM", "OFFNUM", "OFFNAME", "ADDRESS", "CBSA", "CBSA_NO", "CBSA_METRO_NAME", "STNAME", "CITY", "COUNTY", "STCNTY", "SERVTYPE", "LATITUDE", "LONGITUDE", "RUNDATE"];
bbbMap.branchFields = [
    { alias: "Cert", name: "CERT", type: "sting", _print: false },
    { alias: "Name", name: "NAME", type: "sting", _print: false },
    { alias: "Office #", name: "OFFNUM", type: "sting", _print: true },
    { alias: "Office Name", name: "OFFNAME", type: "sting", _print: true },
    { alias: "Uninum", name: "UNINUM", type: "sting", _print: true },
    { alias: "Address", name: "ADDRESS", type: "sting", _print: true },
    { alias: "CBSA", name: "CBSA", type: "sting", _print: true },
    { alias: "CBSA #", name: "CBSA_NO", type: "sting", _print: true },
    { alias: "State", name: "STNAME", type: "sting", _print: true },
    { alias: "City", name: "CITY", type: "sting", _print: true },
    { alias: "County", name: "COUNTY", type: "sting", _print: true },
    { alias: "Service Type", name: "SERVTYPE", type: "sting", _print: true },
];

bbbMap.tractOutFields = ["OBJECTID", "GEOID", "NAME", "State", "County", "B01001_001E"];
bbbMap.tractFields = [
    { alias: "GEOID", name: "GEOID", type: "sting", _print: false },
    { alias: "Name", name: "NAME", type: "sting", _print: true },
    { alias: "State", name: "State", type: "sting", _print: true },
    { alias: "County", name: "County", type: "sting", _print: true },
    { alias: "Total Population", name: "B01001_001E", type: "sting", _print: true },
];

bbbMap.ROW_LIMIT = 100;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
    bbbMap.init();
});
